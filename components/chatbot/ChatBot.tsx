import { useEffect, useState, useRef, useContext, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import LoginContext from "@/utils/contexts/login";
import { v4 as uuidv4 } from "uuid";
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { PulseLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";
import { BatteryCharging } from "lucide-react";
import { PERSONA_ROLE_DEVELOPER, COHERE, ANTHROPIC, DEFAULT_AI_MODEL } from "@/utils/constants";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";
import { useIsMobile } from "../hooks/use-mobile";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";

type ApiResponse = {
    response: string;
    modelName: string;
    enabled: boolean;
};

//https://sdk.vercel.ai/providers/legacy-providers/aws-bedrock
function ChatBotInterface({
    cardRef,
    isOpen,
    toggleSidebar,
}: {
    cardRef: React.RefObject<HTMLDivElement>;
    isOpen: boolean;
    toggleSidebar: (boolean?: boolean) => void;
}) {
    const [input, setInput] = useState("");
    const startArray: object[] = [];
    const [messages, setMessages] = useState(startArray);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHeaderHeight, setChatHeaderHeight] = useState(0);
    const [chatFooterHeight, setChatFooterHeight] = useState(0);
    const isMobile = useIsMobile();
    const client = useLDClient();
    const { toast } = useToast();
    const aiConfigKey = "ai-config--togglebot";
    const aiNewModelChatbotFlag =
        useFlags()["ai-config--togglebot"] == undefined
            ? DEFAULT_AI_MODEL
            : useFlags()["ai-config--togglebot"];

    async function sendChatbotFeedback(feedback: string) {
        const response = await fetch("/api/chatbotfeedback", {
            method: "POST",
            body: JSON.stringify({
                feedback,
                aiConfigKey,
            }),
        });
        const data = await response.json();
    }

    const { userObject } = useContext(LoginContext);
    const { logLDMetricSent } = useContext(LiveLogsContext);
    let apiResponse: ApiResponse = {
        response: "",
        modelName: "",
        enabled: false,
    };

    const handleInputChange = (e: any) => {
        setInput(e.target.value);
    };

    async function submitQuery() {
        const userInput = input;
        setInput("");
        setIsLoading(true);
        const userMessage = {
            role: "user",
            content: userInput,
            id: uuidv4().slice(0, 4),
        };

        const loadingMessage = {
            role: "loader",
            content: "loading",
            id: uuidv4().slice(0, 4),
        };

        setMessages([...messages, userMessage, loadingMessage]);

        const response = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
                aiConfigKey,
                userInput,
            }),
        });

        //Data includes {response: "", "modelName": ""}
        const data = await response.json();
        apiResponse = data;

        let aiAnswer = data.response || "I'm sorry. Please try again.";

        let assistantMessage = {
            role: "assistant",
            content: aiAnswer,
            id: uuidv4().slice(0, 4),
        };

        if (aiAnswer === undefined && !userObject.personarole?.includes(PERSONA_ROLE_DEVELOPER)) {
            assistantMessage.content = "I'm sorry. Please try again.";
            setMessages([...messages, userMessage, assistantMessage]);
        } else if (
            aiAnswer === undefined &&
            userObject.personarole?.includes(PERSONA_ROLE_DEVELOPER)
        ) {
            assistantMessage.content = data; //error message
            setMessages([...messages, userMessage, assistantMessage]);
        } else {
            setMessages([...messages, userMessage, assistantMessage]);
        }
        setIsLoading(false);
    }

    const surveyResponseNotification = (surveyResponse: string) => {
        client?.track(surveyResponse, client.getContext());

        sendChatbotFeedback(surveyResponse);
        logLDMetricSent(surveyResponse);
        client?.flush();
        toast({
            title: `Thank you for your response!`,
            wrapperStyle: "bg-green-600 text-white font-sohne text-base border-none",
        });
    };

    const chatContentRef = useRef<HTMLDivElement>(null);
    const chatHeaderRef = useRef<HTMLDivElement>(null);
    const chatFooterRef = useRef<HTMLDivElement>(null);

    const aiModelName = () => {
        if (aiNewModelChatbotFlag?.model?.name?.includes("cohere")) {
            return "Cohere Command";
        } else {
            return "Anthropic Claude";
        }
    };

    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (chatHeaderRef.current?.offsetHeight) {
            setChatHeaderHeight(chatHeaderRef?.current?.offsetHeight);
        }
    }, [chatHeaderHeight]);

    useEffect(() => {
        if (chatFooterRef.current?.offsetHeight) {
            setChatFooterHeight(chatFooterRef?.current?.offsetHeight);
        }
    }, [chatFooterHeight]);

    return (
        <>
            {isOpen && (
                <div
                    ref={cardRef}
                    className="relative lg:fixed lg:bottom-16 lg:right-0 lg:z-50 flex items-end justify-end p-0 lg:p-6 max-w-full "
                >
                    <Card className="w-full lg:max-w-md lg:mx-auto">
                        <CardHeader className="flex flex-row items-center" ref={chatHeaderRef}>
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                    <img src={"/personas/ToggleAvatar.png"} alt="Chatbot Avatar" />{" "}
                                    <AvatarFallback>CB</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">
                                        Chatbot Assistant
                                    </p>
                                    {aiNewModelChatbotFlag?.model?.name && (
                                        <>
                                            <p
                                                className={
                                                    "text-sm text-gray-500 dark:text-gray-400"
                                                }
                                            >
                                                Powered by{" "}
                                                <span
                                                    className={`font-bold text-white ${
                                                        aiNewModelChatbotFlag?.model?.name?.includes(
                                                            COHERE
                                                        )
                                                            ? "!text-cohereColor"
                                                            : ""
                                                    } 
                      ${
                          aiNewModelChatbotFlag?.model?.name?.includes(ANTHROPIC)
                              ? "!text-anthropicColor"
                              : ""
                      }
                      `}
                                                >
                                                    {aiModelName()}
                                                </span>{" "}
                                                with{" "}
                                                <span className="text-amazonColor font-bold">
                                                    {" "}
                                                    Amazon Bedrock{" "}
                                                </span>
                                            </p>{" "}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="ml-auto flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="How was our service today?"
                                    className="rounded-full bg-[#55efc4] text-gray-900 hover:bg-[#00b894] dark:bg-[#55efc4] dark:text-gray-900 dark:hover:bg-[#00b894]"
                                    onClick={() => {
                                        surveyResponseNotification("AI chatbot good service");
                                    }}
                                >
                                    <SmileIcon className="h-6 w-6" />
                                    <span className="sr-only">Good</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="How was our service today?"
                                    className="rounded-full bg-[#ff7675] text-gray-50 hover:bg-[#d63031] dark:bg-[#ff7675] dark:text-gray-50 dark:hover:bg-[#d63031]"
                                    onClick={() => {
                                        surveyResponseNotification("AI Chatbot Bad Service");
                                    }}
                                >
                                    <FrownIcon className="h-6 w-6" />
                                    <span className="sr-only">Bad</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-auto rounded-full hidden lg:block"
                                    onClick={() => toggleSidebar(false)}
                                >
                                    <XIcon className="h-6 w-6" />
                                    <span className="sr-only">Close Chatbot</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent
                            className={`lg:h-[500px] overflow-y-auto`}
                            ref={chatContentRef}
                            style={
                                isMobile
                                    ? {
                                          height: `calc(100vh - ${
                                              chatHeaderHeight + chatFooterHeight + 40
                                          }px)`,
                                      }
                                    : {}
                            }
                        >
                            {aiNewModelChatbotFlag?._ldMeta?.enabled && (
                                <div className="space-y-4">
                                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                                        Hello! How can I assist you today?
                                    </div>
                                    {messages.map((m) => {
                                        if (m?.role === "assistant") {
                                            return (
                                                <div
                                                    key={m?.id}
                                                    className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800"
                                                >
                                                    {m?.content}
                                                </div>
                                            );
                                        }

                                        if (m?.role === "loader" && isLoading) {
                                            return (
                                                <div
                                                    key={m?.id}
                                                    className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800"
                                                >
                                                    <PulseLoader className="" />
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={m?.id}
                                                className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-gradient-airways text-white dark:bg-gray-50 dark:text-gray-900"
                                            >
                                                {m?.content}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="p-4 lg:p-6" ref={chatFooterRef}>
                            <form
                                className="flex w-full items-center space-x-2"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                {aiNewModelChatbotFlag?._ldMeta?.enabled === false ? (
                                    <p className="text-airlinegray">
                                        We are offline for today. Please return next time!
                                    </p>
                                ) : (
                                    <>
                                        <Input
                                            id="message"
                                            placeholder="Type your message..."
                                            className="flex-1"
                                            autoComplete="off"
                                            value={input}
                                            onChange={handleInputChange}
                                        />
                                        <Button
                                            type="submit"
                                            size="icon"
                                            onClick={() => submitQuery()}
                                            className="bg-airlinedarkblue"
                                        >
                                            <SendIcon className="h-4 w-4" />
                                            <span className="sr-only">Send</span>
                                        </Button>
                                    </>
                                )}
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </>
    );
}

export default function Chatbot() {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const aiNewModelChatbotFlag =
        useFlags()["ai-config--togglebot"] == undefined
            ? DEFAULT_AI_MODEL
            : useFlags()["ai-config--togglebot"];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                toggleSidebar(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const toggleSidebar = useCallback(
        (boolean?: boolean) => {
            if (boolean === false) {
                return isMobile ? setOpenMobile(false) : setIsOpen(false);
            }
            return isMobile ? setOpenMobile((open) => !open) : setIsOpen((open) => !open);
        },
        [isMobile, setIsOpen, setOpenMobile]
    );

    return (
        <>
            <div className="fixed bottom-4 right-4 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-airlinedarkblue text-gray-50 hover:bg-airlinedarkblue/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 shadow-lg !h-12 !w-12 animate-pulse hover:animate-none"
                    onClick={() => toggleSidebar()}
                >
                    {isOpen && <XIcon className="h-8 w-8" />}
                    {!isOpen && aiNewModelChatbotFlag?._ldMeta?.enabled !== false && (
                        <MessageCircleIcon className="h-8 w-8" />
                    )}
                    {!isOpen && aiNewModelChatbotFlag?._ldMeta?.enabled === false && (
                        <BatteryCharging className="h-8 w-8" />
                    )}
                    <span className="sr-only">Open Chatbot</span>
                </Button>
            </div>
            {isMobile ? (
                <Sheet open={openMobile} onOpenChange={setOpenMobile}>
                    <SheetContent
                        data-sidebar="sidebar"
                        data-mobile="true"
                        className="w-full h-full bg-sidebar p-0 text-sidebar-foreground !border-0 [&>button]:hidden"
                        side={"right"}
                        id="sidebar-mobile"
                    >
                        <div className="flex h-full w-full flex-col ">
                            <ChatBotInterface
                                cardRef={cardRef}
                                isOpen={openMobile}
                                toggleSidebar={toggleSidebar}
                            />
                            <SheetClose className="h-10 w-full bg-airlinedarkblue text-white">
                                Close
                            </SheetClose>
                        </div>
                    </SheetContent>
                </Sheet>
            ) : (
                <ChatBotInterface cardRef={cardRef} isOpen={isOpen} toggleSidebar={toggleSidebar} />
            )}
        </>
    );
}

function MessageCircleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    );
}

function SendIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    );
}

function XIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function SmileIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
    );
}

function FrownIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
    );
}
