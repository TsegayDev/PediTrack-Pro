import { Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground sm:flex sm:justify-between sm:items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} PediTrack Pro. All Rights Reserved.
        </p>
        <div className="mt-4 sm:mt-0 text-sm">
          <p className="font-medium">Developed by Tsegay G.</p>
          <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-4 mt-1">
            <a
              href="tel:+2519463512"
              className="flex items-center justify-center sm:justify-start gap-1.5 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              +2519463512
            </a>
            <a
              href="mailto:tsegaydev@gmail.com"
              className="flex items-center justify-center sm:justify-start gap-1.5 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              tsegaydev@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
