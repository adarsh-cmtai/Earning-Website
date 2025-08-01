"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchAllContent, deleteFaq, deleteTutorial } from "@/lib/redux/features/admin/contentSlice";
import { fetchAdminTopics, addAdminTopic, deleteAdminTopic } from "@/lib/redux/features/admin/adminTopicsSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { type FaqItem, type TutorialItem } from "@/lib/types";
import { FAQModal } from "@/components/admin/content/FAQModal";
import { TutorialModal } from "@/components/admin/content/TutorialModal";
import { DeleteConfirmationModal } from "@/components/admin/content/DeleteConfirmationModal";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type ModalState = { type: "faq" | "tutorial" | "delete" | null; data?: FaqItem | TutorialItem | { _id: string; name: string, type: 'faq' | 'tutorial' | 'topic' } };

const EmptyState = ({ title, description, ctaText, onCtaClick }: { title: string, description: string, ctaText?: string, onCtaClick?: () => void }) => (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center min-h-[250px] bg-muted/40">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {ctaText && onCtaClick && <Button size="sm" className="mt-4" onClick={onCtaClick}><PlusCircle className="mr-2 h-4 w-4" />{ctaText}</Button>}
    </div>
);

const ContentSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
    </Card>
);

export default function ContentPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { faq, tutorials, status: contentStatus } = useSelector((state: RootState) => state.adminContent);
    const { list: topics, status: topicsStatus } = useSelector((state: RootState) => state.adminTopics);

    const [newTopic, setNewTopic] = useState('');
    const [isAddingTopic, setIsAddingTopic] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({ type: null });

    useEffect(() => {
        dispatch(fetchAllContent());
        dispatch(fetchAdminTopics());
    }, [dispatch]);

    const handleOpenModal = (type: ModalState["type"], data?: ModalState["data"]) => setModalState({ type, data });
    const handleCloseModal = () => setModalState({ type: null });

    const handleAddTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopic.trim()) return;
        setIsAddingTopic(true);
        const toastId = toast.loading("Adding new topic...");
        try {
            await dispatch(addAdminTopic(newTopic)).unwrap();
            toast.success("Topic added successfully!", { id: toastId });
            setNewTopic("");
        } catch (error: any) {
            toast.error(error.message || "Failed to add topic.", { id: toastId });
        } finally {
            setIsAddingTopic(false);
        }
    };

    const handleDelete = async () => {
        if (modalState.type !== 'delete' || !modalState.data) return;
        const { _id, type } = modalState.data as { _id: string; type: 'faq' | 'tutorial' | 'topic' };
        const toastId = toast.loading(`Deleting item...`);
        try {
            if (type === 'faq') await dispatch(deleteFaq(_id)).unwrap();
            else if (type === 'tutorial') await dispatch(deleteTutorial(_id)).unwrap();
            else if (type === 'topic') await dispatch(deleteAdminTopic(_id)).unwrap();
            toast.success("Item deleted successfully.", { id: toastId });
            handleCloseModal();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete item.", { id: toastId });
        }
    };

    const renderMainContent = () => (
        <Tabs defaultValue="faq" className="w-full">
            <div className="overflow-x-auto pb-1">
                 <TabsList className="inline-flex h-auto w-max sm:w-full sm:grid sm:grid-cols-3">
                    <TabsTrigger value="faq">FAQs</TabsTrigger>
                    <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
                    <TabsTrigger value="topics">Content Topics</TabsTrigger>
                </TabsList>
            </div>

            <div className="mt-6">
                <TabsContent value="faq"><Card><CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Frequently Asked Questions</CardTitle><CardDescription>Manage the FAQ section for your users.</CardDescription></div><Button variant="outline" onClick={() => handleOpenModal("faq")}><PlusCircle className="mr-2 h-4 w-4" />Add FAQ</Button></CardHeader><CardContent>{faq.length > 0 ? <Accordion type="single" collapsible className="w-full">{faq.map((item) => (<AccordionItem key={item._id} value={item._id} className="group"><AccordionTrigger className="hover:no-underline text-left"><span>{item.question}</span></AccordionTrigger><AccordionContent><div className="prose prose-sm dark:prose-invert max-w-none pb-4">{item.answer}</div><div className="flex justify-end gap-2 border-t pt-3"><Button variant="secondary" size="sm" onClick={() => handleOpenModal("faq", item)}><Edit className="mr-2 h-3 w-3" />Edit</Button><Button variant="destructive" size="sm" onClick={() => handleOpenModal("delete", { _id: item._id, name: "this FAQ", type: 'faq' })}><Trash2 className="mr-2 h-3 w-3" />Delete</Button></div></AccordionContent></AccordionItem>))}</Accordion> : <EmptyState title="No FAQs Yet" description="Create your first FAQ to help users." ctaText="Add First FAQ" onCtaClick={() => handleOpenModal('faq')} />}</CardContent></Card></TabsContent>
                <TabsContent value="tutorials"><Card><CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Video Tutorials</CardTitle><CardDescription>Provide helpful video guides for your users.</CardDescription></div><Button variant="outline" onClick={() => handleOpenModal("tutorial")}><PlusCircle className="mr-2 h-4 w-4" />Add Tutorial</Button></CardHeader><CardContent>{tutorials.length > 0 ? <div className="border rounded-md overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>URL</TableHead><TableHead className="text-right w-[120px]">Actions</TableHead></TableRow></TableHeader><TableBody>{tutorials.map((tut) => (<TableRow key={tut._id} className="hover:bg-muted/50"><TableCell className="font-medium">{tut.title}</TableCell><TableCell><a href={tut.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1.5">{tut.url.length > 50 ? `${tut.url.substring(0,50)}...` : tut.url} <ExternalLink className="h-3 w-3 shrink-0" /></a></TableCell><TableCell className="text-right space-x-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal("tutorial", tut)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleOpenModal("delete", { _id: tut._id, name: "this tutorial", type: 'tutorial' })}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>))}</TableBody></Table></div> : <EmptyState title="No Tutorials Yet" description="Add your first video tutorial to guide users." ctaText="Add First Tutorial" onCtaClick={() => handleOpenModal('tutorial')} />}</CardContent></Card></TabsContent>
                <TabsContent value="topics"><Card><CardHeader><CardTitle>Content Topics</CardTitle><CardDescription>Manage topics for AI-generated videos.</CardDescription></CardHeader><CardContent><form onSubmit={handleAddTopic} className="flex items-center gap-2 mb-6"><Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="e.g., Health & Fitness Tips" className="flex-1" disabled={isAddingTopic} /><Button type="submit" disabled={isAddingTopic || !newTopic.trim()}>{isAddingTopic ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}Add Topic</Button></form><div className="border rounded-md overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Topic Name</TableHead><TableHead className="text-right w-[100px]">Actions</TableHead></TableRow></TableHeader><TableBody>{topicsStatus === 'loading' ? [...Array(3)].map((_,i)=><TableRow key={i}><TableCell><Skeleton className="h-4 w-48"/></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto"/></TableCell></TableRow>) : topics.length > 0 ? topics.map((topic) => (<TableRow key={topic._id} className="hover:bg-muted/50"><TableCell className="font-medium">{topic.name}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleOpenModal('delete', { _id: topic._id, name: `the topic "${topic.name}"`, type: 'topic' })}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>)) : <TableRow><TableCell colSpan={2} className="h-24 text-center text-muted-foreground">No topics created yet.</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card></TabsContent>
            </div>
        </Tabs>
    );

    return (
        <>
            <main className="flex flex-1 flex-col gap-6">
                <div className="flex items-center">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Content Management</h1>
                </div>
                {contentStatus === 'loading' ? <ContentSkeleton /> : renderMainContent()}
            </main>

            <FAQModal isOpen={modalState.type === "faq"} onClose={handleCloseModal} faq={modalState.data as FaqItem | undefined} />
            <TutorialModal isOpen={modalState.type === "tutorial"} onClose={handleCloseModal} tutorial={modalState.data as TutorialItem | undefined} />
            <DeleteConfirmationModal isOpen={modalState.type === "delete"} onClose={handleCloseModal} onConfirm={handleDelete} itemName={(modalState.data as any)?.name || "item"} />
        </>
    );
}