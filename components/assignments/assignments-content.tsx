"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchAssignments, completeTask, clearDailyReward } from "@/lib/redux/features/user/assignmentsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, Clock, ExternalLink, Info, Youtube, History } from "lucide-react";
import { AssignmentCompletionModal } from "./assignment-completion-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AssignmentsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: assignments, completedCount, totalCount, status, dailyReward } = useSelector((state: RootState) => state.userAssignments);
  
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [watchingAssignmentId, setWatchingAssignmentId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});
  
  const assignmentsRef = useRef(assignments);
  useEffect(() => { assignmentsRef.current = assignments; }, [assignments]);

  useEffect(() => { if (status === 'idle') { dispatch(fetchAssignments()); } }, [status, dispatch]);
  
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const updated = { ...prev };
        let taskCompleted = false;
        for (const id in updated) {
          if (updated[id] > 0) { updated[id]--; } 
          else {
            const currentAssignments = assignmentsRef.current;
            const assignment = currentAssignments.find(a => a.id === id);
            if (assignment) {
                if (assignment && assignment.status !== 'completed') {
                    dispatch(completeTask({ link: assignment.youtubeUrl, isCarryOver: !!assignment.isCarryOver }));
                    taskCompleted = true;
                }
            }
            delete updated[id];
          }
        }
        if (taskCompleted) { setWatchingAssignmentId(null); }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => { if (dailyReward) { setShowCompletionModal(true); } }, [dailyReward]);

  const handleWatchVideo = (assignment: any) => {
    const duration = assignment.type === "Long" ? 600 : 55;
    setTimeRemaining(prev => ({ ...prev, [assignment.id]: duration }));
    setWatchingAssignmentId(assignment.id);
    window.open(assignment.youtubeUrl, "_blank");
  };

  const handleCloseCompletionModal = () => { setShowCompletionModal(false); dispatch(clearDailyReward()); };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "in-progress": return "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20";
      default: return "bg-gray-200 text-gray-700 border-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600";
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4 animate-spin" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  if (status === 'loading' && assignments.length === 0) { return <div className="text-center p-8">Loading assignments...</div>; }
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Daily Assignments</h1>
        <p className="text-muted-foreground text-lg">Complete your daily video assignments to earn rewards.</p>
      </div>
      <Alert className="border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400" />
        <AlertTitle className="font-bold">Assignment Instructions</AlertTitle>
        <AlertDescription>Click 'Watch & Subscribe', watch the video, and subscribe. A timer based on video type (Short: 55s, Long: 10m) will start here. The task will complete automatically when the timer finishes.</AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-lg"><CardHeader><CardTitle className="text-base text-muted-foreground">Overall Progress</CardTitle></CardHeader><CardContent><Progress value={progress} className="h-2" /><div className="flex justify-between text-sm mt-2"><span>Completed</span><span className="font-medium">{completedCount}/{totalCount}</span></div></CardContent></Card>
        <Card className="rounded-lg"><CardContent className="p-6 flex items-center gap-4"><div className="p-3 bg-green-100 dark:bg-green-500/10 rounded-full"><CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" /></div><div><div className="text-2xl font-bold">{completedCount}</div><div className="text-sm text-muted-foreground">Tasks Completed</div></div></CardContent></Card>
        <Card className="rounded-lg"><CardContent className="p-6 flex items-center gap-4"><div className="p-3 bg-yellow-100 dark:bg-yellow-500/10 rounded-full"><Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" /></div><div><div className="text-2xl font-bold">{totalCount - completedCount}</div><div className="text-sm text-muted-foreground">Tasks Remaining</div></div></CardContent></Card>
      </div>
      <Card className="rounded-lg">
        <CardHeader><CardTitle>Assignment List</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {assignments.map((assignment) => {
              const isInProgress = timeRemaining[assignment.id] != null;
              const currentStatus = isInProgress ? 'in-progress' : assignment.status;
              return (
              <Card key={assignment.id} className="flex flex-col justify-between rounded-lg">
                <CardContent className="p-4">
                  <div className="relative mb-3">
                    <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center"><Youtube className="h-10 w-10 text-muted-foreground"/></div>
                    <div className="absolute top-2 right-2"><Badge className={getStatusClasses(currentStatus)} variant="outline"><div className="flex items-center gap-1">{getStatusIcon(currentStatus)}<span className="capitalize text-xs">{currentStatus.replace('-', ' ')}</span></div></Badge></div>
                    {assignment.isCarryOver && <div className="absolute top-2 left-2"><Badge variant="destructive"><History className="mr-1 h-3 w-3"/>Carried Over</Badge></div>}
                    <div className="absolute bottom-2 left-2"><Badge className="bg-black/70 text-white text-xs">{assignment.type}</Badge></div>
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2">{assignment.title}</h4>
                  {isInProgress && (<div className="mt-3 p-2 bg-sky-100 dark:bg-sky-500/10 rounded-lg text-center"><span className="font-mono font-semibold text-sky-700 dark:text-sky-300">{Math.floor(timeRemaining[assignment.id] / 60)}:{(timeRemaining[assignment.id] % 60).toString().padStart(2, "0")}</span></div>)}
                </CardContent>
                <div className="p-4 pt-0">
                  <Button onClick={() => handleWatchVideo(assignment)} disabled={assignment.status === "completed" || watchingAssignmentId != null} className="w-full" variant={assignment.status === "completed" ? "outline" : "default"}>
                    {assignment.status === "completed" ? (<><CheckCircle className="mr-2 h-4 w-4" />Completed</>) : watchingAssignmentId === assignment.id ? (<><Clock className="mr-2 h-4 w-4 animate-spin" />Watching...</>) : (<><ExternalLink className="mr-2 h-4 w-4" />Watch & Subscribe</>)}
                  </Button>
                </div>
              </Card>
            )})}
          </div>
        </CardContent>
      </Card>
      <AssignmentCompletionModal open={showCompletionModal} onClose={handleCloseCompletionModal} reward={dailyReward} />
    </div>
  )
}