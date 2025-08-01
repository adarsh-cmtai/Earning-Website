"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy, Gift, ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { type AiVideo } from "@/lib/types"

interface CompletionReward {
    aiVideoUnlocked: boolean;
    assignedVideo: AiVideo | null;
}

interface AssignmentCompletionModalProps {
  open: boolean
  onClose: () => void
  reward: CompletionReward | null
}

export function AssignmentCompletionModal({ open, onClose, reward }: AssignmentCompletionModalProps) {
  const router = useRouter();
  if (!reward) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-full w-20 h-20 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">🎉 Congratulations! 🎉</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">You've completed all pending assignments!</p>

          {reward.aiVideoUnlocked ? (
             <div className="bg-green-500/10 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2"><CheckCircle className="h-5 w-5 text-green-500" /><span className="font-semibold">AI Video Unlocked!</span></div>
                <p className="text-sm text-green-700 dark:text-green-300">Your next AI-generated video is now available for download.</p>
            </div>
          ) : (
            <div className="bg-blue-500/10 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2"><Gift className="h-5 w-5 text-blue-600" /><span className="font-semibold text-blue-800">What's Next?</span></div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Your next AI video will be assigned on your scheduled day. Keep up the great work!</p>
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { onClose(); router.push("/ai-videos"); }}>
              Go to AI Videos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}