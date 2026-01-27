import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import type { Test } from "@/data/tests"

interface TestBreadcrumbsProps {
  test?: Test
}

export function TestBreadcrumbs({ test }: TestBreadcrumbsProps) {
  // Format season label: "Våren" for vår, "Hösten" for höst
  const seasonLabel = test?.season === "vår" ? "Våren" : "Hösten"

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="text-foreground-muted hover:text-primary transition-colors">
              Hem
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {test ? (
            <BreadcrumbLink asChild>
              <Link href="/hogskoleprovet" className="text-foreground-muted hover:text-primary transition-colors">
                Gamla prov
              </Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Gamla prov</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {test && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {seasonLabel} {test.year}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
