/**
 * Clipboard Hook
 * Reusable hook for clipboard operations with toast notifications
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/shared/components/ui/use-toast';
import { copyToClipboard } from '@/shared/utils/clipboard';

interface UseClipboardReturn {
  copy: (text: string, description?: string) => Promise<void>;
  isCopying: boolean;
  lastCopied: string | null;
}

export const useClipboard = (): UseClipboardReturn => {
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);
  const [lastCopied, setLastCopied] = useState<string | null>(null);

  const copy = useCallback(async (text: string, description = 'Text') => {
    setIsCopying(true);
    
    try {
      const success = await copyToClipboard(text);
      
      if (success) {
        setLastCopied(text);
        toast({
          title: 'Copied',
          description: `${description} copied to clipboard.`,
        });
      } else {
        toast({
          title: 'Copy failed',
          description: 'Unable to copy to clipboard. Please copy manually.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard. Please copy manually.',
        variant: 'destructive',
      });
    } finally {
      setIsCopying(false);
    }
  }, [toast]);

  return { copy, isCopying, lastCopied };
};