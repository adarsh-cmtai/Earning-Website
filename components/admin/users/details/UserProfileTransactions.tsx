import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export function UserProfileTransactions({ transactions }: { transactions: any[] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader><CardTitle>Transaction History</CardTitle><CardDescription>A log of all financial activities for this user.</CardDescription></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
          <TableBody>
            {transactions.map(txn => (
                <TableRow key={txn._id}>
                    <TableCell>
                        <div className="font-medium">{format(new Date(txn.createdAt), 'PP')}</div>
                        <div className="text-xs text-muted-foreground">{txn.category}</div>
                    </TableCell>
                    <TableCell><Badge variant={txn.type === 'Credit' ? 'default' : 'destructive'}>{txn.type}</Badge></TableCell>
                    <TableCell className={`text-right font-semibold ${txn.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`}>
                        {txn.type === 'Credit' ? '+' : '-'}₹{Math.abs(txn.amount).toLocaleString()}
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}