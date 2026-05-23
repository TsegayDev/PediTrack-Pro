import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PageDescriptionProps {
  title: string;
  description: string;
}

export function PageDescription({ title, description }: PageDescriptionProps) {
  return (
    <Card className="mb-8 bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-primary">
          <Info className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
