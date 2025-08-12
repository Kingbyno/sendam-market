"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, FileText, AlertCircle } from "lucide-react"
import { acceptTerms, getActiveTermsVersion } from "@/lib/actions/terms-actions"
import { useToast } from "@/hooks/use-toast"
import type { TermsVersion } from "@/lib/types"
import ReactMarkdown from "react-markdown"

interface TermsAgreementProps {
  agreementType: "seller_terms" | "buyer_terms" | "privacy_policy"
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  required?: boolean
}

export function TermsAgreement({ agreementType, isOpen, onClose, onAccept, required = false }: TermsAgreementProps) {
  const [termsVersion, setTermsVersion] = useState<TermsVersion | null>(null)
  const [hasAccepted, setHasAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      loadTermsVersion()
      setHasAccepted(false)
      setHasScrolledToBottom(false)
    }
  }, [isOpen, agreementType])

  const loadTermsVersion = async () => {
    try {
      const version = await getActiveTermsVersion(agreementType)
      setTermsVersion(version)
    } catch (error) {
      console.error("Error loading terms version:", error)
      toast({
        title: "Error",
        description: "Failed to load terms and conditions",
        variant: "destructive",
      })
    }
  }

  const handleAccept = async () => {
    if (!termsVersion) return

    setIsSubmitting(true)

    try {
      await acceptTerms({
        agreementType,
        version: termsVersion.version,
      })

      toast({
        title: "Terms Accepted",
        description: "You have successfully accepted the terms and conditions.",
      })

      onAccept()
      onClose()
    } catch (error) {
      console.error("Error accepting terms:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept terms",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    setHasScrolledToBottom(isAtBottom)
  }

  const getTitle = () => {
    switch (agreementType) {
      case "seller_terms":
        return "Seller Terms and Conditions"
      case "buyer_terms":
        return "Buyer Terms and Conditions"
      case "privacy_policy":
        return "Privacy Policy"
      default:
        return "Terms and Conditions"
    }
  }

  const getIcon = () => {
    switch (agreementType) {
      case "privacy_policy":
        return <Shield className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={required ? undefined : onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {termsVersion?.title || getTitle()}
          </DialogTitle>
          <DialogDescription>
            Please read and accept the terms to continue using our services.
          </DialogDescription>
        </DialogHeader>

        {!termsVersion ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4 max-h-96" onScrollCapture={handleScroll}>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{termsVersion.content}</ReactMarkdown>
              </div>
            </ScrollArea>

            {!hasScrolledToBottom && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Please scroll down to read the complete terms before accepting.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accept-terms"
                  checked={hasAccepted}
                  onCheckedChange={(checked: boolean) => setHasAccepted(checked === true)}
                  disabled={!hasScrolledToBottom}
                />
                <label
                  htmlFor="accept-terms"
                  className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    !hasScrolledToBottom ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  I have read and agree to the {getTitle().toLowerCase()}
                </label>
              </div>

              <div className="flex justify-end gap-2">
                {!required && (
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleAccept}
                  disabled={!hasAccepted || isSubmitting || !hasScrolledToBottom}
                  className="min-w-24"
                >
                  {isSubmitting ? "Accepting..." : "Accept"}
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Version {termsVersion.version} • Last updated: {new Date(termsVersion.createdAt).toLocaleDateString()}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
