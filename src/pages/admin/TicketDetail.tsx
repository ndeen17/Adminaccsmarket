import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTicketById,
  closeTicket,
  assignTicket,
} from "@/services/ticketsService";
import {
  getMessagesByTicketId,
  sendMessageAsAdmin,
  markMessageSeenByAdmin,
  uploadMessageFiles,
} from "@/services/messagesService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageSquare,
  ChevronLeft,
  Paperclip,
  Send,
  UserCheck,
  CheckCircle,
} from "lucide-react";

interface Message {
  id: string;
  message: string;
  ticketId: string;
  senderId: string;
  admin_id?: string;
  messageType: string;
  seen: boolean;
  time_received: string;
}

const TicketDetail = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [fetchedImage, setFetchedImage] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const { data: ticketData, isLoading: isTicketLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicketById(ticketId!),
    enabled: !!ticketId,
  });

  const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
    queryKey: ["messages", ticketId],
    queryFn: () => getMessagesByTicketId(ticketId!),
    enabled: !!ticketId,
    refetchInterval: 40000, // Refetch messages every 10 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: (messageData: any) => sendMessageAsAdmin(messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", ticketId] });
      setNewMessage("");
      setFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  // Fetch images for messages starting with "get-image"
  useEffect(() => {
    if (messagesData?.result) {
      messagesData.result.forEach((message: Message) => {
        if (message.message.startsWith("get-image")) {
          const fetchImage = async (link: string) => {
            try {
              const response = await fetch(
                `https://aitool.asoroautomotive.com/api/${link}`,
                {
                  method: "GET",
                  credentials: "include",
                }
              );

              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const imageSrc = await response.text();
              setFetchedImage((prev) => ({
                ...prev,
                [message.id]: imageSrc, // Store the image source by message ID
              }));
            } catch (error) {
              console.error("Error fetching image:", error);
            }
          };

          fetchImage(message.message);
        }
      });
    }
  }, [messagesData?.result]);

  const uploadFilesMutation = useMutation({
    mutationFn: (formData: FormData) => uploadMessageFiles(formData),
    onSuccess: (data) => {
      // After uploading files, send a message with the file URLs
      sendMessageMutation.mutate({
        ticket_id: ticketId,
        message: data.fileUrls.join(", "),
        admin_id: admin?.admin_id,
        message_type: "file",
      });
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload files");
      setIsUploading(false);
    },
  });

  const markSeenMutation = useMutation({
    mutationFn: (messageId: string) => markMessageSeenByAdmin(messageId),
    onError: (error: any) => {
      console.error("Failed to mark message as seen:", error);
    },
  });

  const closeTicketMutation = useMutation({
    mutationFn: (id: string) => closeTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      toast.success("Ticket closed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to close ticket");
    },
  });

  const assignTicketMutation = useMutation({
    mutationFn: (id: string) => assignTicket(id, admin?.admin_id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      toast.success("Ticket assigned to you");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign ticket");
    },
  });

  // Mark unread messages as seen
  useEffect(() => {
    if (messagesData?.result) {
      messagesData.result.forEach((message: Message) => {
        if (!message.seen && message.senderId !== admin?.admin_id) {
          markSeenMutation.mutate(message.id);
        }
      });
    }
  }, [messagesData?.result, admin?.admin_id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    console.log(messagesData);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.result]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() && (!files || files.length === 0)) {
      toast.error("Please enter a message or attach a file");
      return;
    }

    if (files && files.length > 0) {
      // Handle file upload
      setIsUploading(true);

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      uploadFilesMutation.mutate(formData);
    } else {
      // Handle text message
      sendMessageMutation.mutate({
        ticket_id: ticketId,
        message: newMessage,
        admin_id: admin?.admin_id,
        message_type: "text",
      });
    }
  };

  const handleCloseTicket = () => {
    if (window.confirm("Are you sure you want to close this ticket?")) {
      closeTicketMutation.mutate(ticketId!);
    }
  };

  const handleAssignTicket = () => {
    assignTicketMutation.mutate(ticketId!);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (isTicketLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const ticket = ticketData?.ticket;
  const messages = messagesData?.result || [];
  const isClosed = ticket?.status.toLowerCase() === "closed";
  const isAssigned = !!ticket?.admin_id;
  const isAssignedToCurrentAdmin = ticket?.admin_id === admin?.admin_id;

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/dashboard/tickets")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {ticket?.title}
            </h1>
            <p className="text-muted-foreground">
              Ticket #{ticket?.id} - {ticket?.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isAssigned && (
            <Button
              variant="outline"
              onClick={handleAssignTicket}
              disabled={isClosed || assignTicketMutation.isPending}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Assign to Me
            </Button>
          )}
          {!isClosed && (
            <Button
              variant="outline"
              onClick={handleCloseTicket}
              disabled={closeTicketMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Close Ticket
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
        <div className="md:col-span-3 flex flex-col">
          <Card className="glass-card flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {isMessagesLoading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages
                    .slice() // Create a shallow copy of the array to avoid mutating the original
                    .sort(
                      (a: Message, b: Message) =>
                        new Date(a.time_received).getTime() -
                        new Date(b.time_received).getTime()
                    ) // Sort by time_received
                    .map((message: Message) => {
                      const isAdmin =
                        message.admin_id === admin?.admin_id ||
                        message.admin_id === "admin";
                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            !isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex ${
                              !isAdmin ? "flex-row-reverse" : "flex-row"
                            } items-start gap-2 max-w-[80%]`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {!isAdmin ? "A" : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div
                                className={`px-4 py-2 rounded-lg ${
                                  !isAdmin
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                {message.message.startsWith("get-image") ? (
                                  <img
                                    src={fetchedImage[message.id]}
                                    alt="Image loading ..."
                                    className="max-w-full h-auto"
                                  />
                                ) : (
                                  <p>{message.message}</p>
                                )}
                              </div>
                              <p
                                className={`text-xs mt-1 text-muted-foreground ${
                                  !isAdmin ? "text-right" : "text-left"
                                }`}
                              >
                                {formatTimestamp(message.time_received)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t p-4">
              <form onSubmit={handleSendMessage} className="w-full">
                <div className="flex gap-2">
                  <Textarea
                    placeholder={
                      isClosed
                        ? "This ticket is closed"
                        : "Type your message here..."
                    }
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isClosed || !isAssignedToCurrentAdmin}
                    className="flex-1 min-h-[60px]"
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={isClosed || !isAssignedToCurrentAdmin}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={
                        isClosed ||
                        isUploading ||
                        sendMessageMutation.isPending ||
                        (!newMessage.trim() &&
                          (!files || files.length === 0)) ||
                        !isAssignedToCurrentAdmin
                      }
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                </div>
                {files && files.length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Selected files:</span>{" "}
                    {Array.from(files)
                      .map((file) => file.name)
                      .join(", ")}
                  </div>
                )}
                {!isAssignedToCurrentAdmin && !isClosed && (
                  <p className="text-sm text-amber-500 mt-2">
                    You need to assign this ticket to yourself before you can
                    reply.
                  </p>
                )}
              </form>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <p className="font-medium capitalize">{ticket?.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created On
                </p>
                <p className="font-medium">
                  {new Date(ticket?.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Submitted By
                </p>
                <p className="font-medium">{ticket?.user_id || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned To
                </p>
                <p className="font-medium">
                  {ticket?.admin_id || "Unassigned"}
                </p>
              </div>
              {/* <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p className="text-sm">{ticket?.description}</p>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
