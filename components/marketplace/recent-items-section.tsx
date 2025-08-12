import { getApprovedItems } from "@/lib/queries/item-queries"
import { ItemGrid } from "./item-grid"
import { SectionTitle } from "./section-title"

export async function RecentItemsSection() {
  const recentItems = await getApprovedItems(8)

  if (!recentItems || recentItems.length === 0) {
    return null
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4">
        <div className="mb-8 animate-fade-in">
          <SectionTitle 
            emoji="🆕" 
            subtitle="Fresh listings from our verified sellers across Nigeria"
          >
            Recently Added Items
          </SectionTitle>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <ItemGrid items={recentItems} />
        </div>
        
        {recentItems.length >= 8 && (
          <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a 
              href="/marketplace" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-muted to-muted/80 hover:from-primary/5 hover:to-primary/10 border border-muted-foreground/20 hover:border-primary/30 rounded-xl font-medium text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>View All Items</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
