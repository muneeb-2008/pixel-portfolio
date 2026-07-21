import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import {
  getAdjacent,
  getCaseStudy,
  hasPendingContent,
  publishedCaseStudies,
  resolve,
  todoNote,
} from "@/lib/case-studies";
import { Scene } from "@/components/case-study/scene";
import { CaseHero } from "@/components/case-study/case-hero";
import { CaseProgress } from "@/components/case-study/case-nav";
import { NextProject } from "@/components/case-study/next-project";
import { MediaTodo } from "@/components/case-study/content-todo";
import {
  PendingContent,
  Prose,
  ProseList,
  Statement,
  UserGroups,
} from "@/components/case-study/narrative";
import {
  Insights,
  Principles,
  ResearchActivities,
} from "@/components/case-study/discovery";
import { FlowDiagram, IaDiagram } from "@/components/case-study/structure";
import { DecisionRecords } from "@/components/case-study/decisions";
import { AiBehaviourSpec } from "@/components/case-study/ai-behaviour";
import {
  Collaboration,
  DesignSystemOverview,
  TestingResults,
} from "@/components/case-study/craft";
import { Metrics, TestimonialBlock } from "@/components/case-study/results";
import {
  BeforeAfterView,
  Gallery,
  PrototypePlayer,
} from "@/components/case-study/media";

const BASE_URL = "https://muneebqureshi.design";

export function generateStaticParams() {
  return publishedCaseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.seo.title,
    description: study.seo.description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      type: "article",
      title: study.seo.title,
      description: study.seo.description,
      url: `/work/${study.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: study.seo.title,
      description: study.seo.description,
    },
    // Placeholder narrative must never be indexed as real work.
    robots: hasPendingContent(study)
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const { previous, next } = getAdjacent(slug);
  const { density, diagram } = study.theme;

  const themeVars = {
    "--accent": study.theme.accent,
    "--accent-soft": study.theme.accentSoft,
  } as CSSProperties;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    headline: study.seo.title,
    description: study.seo.description,
    url: `${BASE_URL}/work/${study.slug}`,
    dateCreated: study.year,
    genre: study.category,
    about: study.industry,
    keywords: study.services.join(", "),
    creator: {
      "@type": "Person",
      name: "Muneeb Qureshi",
      jobTitle: "Product Designer",
      url: BASE_URL,
    },
  };

  const gallery = resolve(study.gallery);
  const prototypes = resolve(study.prototypes);
  const beforeAfter = study.beforeAfter ? resolve(study.beforeAfter) : null;

  return (
    <div style={themeVars}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CaseProgress
        title={study.title}
        nextSlug={next?.slug}
        nextTitle={next?.shortTitle}
      />

      <article>
        {/* 01 — Project arrival */}
        <CaseHero study={study} />

        {/* 02 — Context and the business goal */}
        <Scene
          id="context"
          step="01"
          eyebrow="Context"
          title="Why this work existed"
          density={density}
          bordered
        >
          <div className="mt-10">
            <PendingContent value={study.businessContext} label="Context needed">
              {(text) => <Prose>{text}</Prose>}
            </PendingContent>
          </div>
        </Scene>

        {/* 03 — Problem */}
        <Scene
          id="problem"
          step="02"
          eyebrow="The problem"
          density={density}
          bordered
        >
          <div className="mt-8">
            <PendingContent value={study.challenge} label="Problem needed">
              {(text) => <Statement>{text}</Statement>}
            </PendingContent>
          </div>
        </Scene>

        {/* 04 — Users */}
        <Scene
          id="users"
          step="03"
          eyebrow="Who it was for"
          title="The people on the other side of the screen"
          density={density}
        >
          <PendingContent value={study.users} label="User groups needed">
            {(groups) => <UserGroups groups={groups} />}
          </PendingContent>
        </Scene>

        {/* 05 — Constraints */}
        <Scene
          id="constraints"
          step="04"
          eyebrow="Constraints"
          title="What the design had to work within"
          density={density}
          bordered
        >
          <PendingContent value={study.constraints} label="Constraints needed">
            {(items) => <ProseList items={items} />}
          </PendingContent>
        </Scene>

        {/* 06 — Role */}
        <Scene
          id="role"
          step="05"
          eyebrow="My role"
          title={`What I owned on ${study.shortTitle}`}
          density={density}
        >
          <PendingContent
            value={study.responsibilities}
            label="Responsibilities needed"
          >
            {(items) => <ProseList items={items} numbered={false} />}
          </PendingContent>
          <div className="mt-10 max-w-xl">
            <PendingContent value={study.team} label="Team needed">
              {(team) => (
                <div className="border-t border-border pt-6">
                  <p className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.18em] text-faint">
                    Team
                  </p>
                  <p className="mt-2 leading-relaxed text-muted">
                    {team.join(" · ")}
                  </p>
                </div>
              )}
            </PendingContent>
          </div>
        </Scene>

        {/* 07 — Research */}
        <Scene
          id="research"
          step="06"
          eyebrow="Research"
          title="What I did to stop guessing"
          density={density}
          bordered
        >
          <PendingContent value={study.research} label="Research needed">
            {(items) => <ResearchActivities items={items} />}
          </PendingContent>
        </Scene>

        {/* 08 — Key insights */}
        <Scene
          id="insights"
          step="07"
          eyebrow="Key insight"
          title="What changed my mind"
          density={density}
        >
          <PendingContent value={study.insights} label="Insights needed">
            {(items) => <Insights items={items} />}
          </PendingContent>
        </Scene>

        {/* 09 — Principles */}
        <Scene
          id="principles"
          step="08"
          eyebrow="Product principles"
          title="The rules I designed against"
          density={density}
          bordered
        >
          <PendingContent
            value={study.productPrinciples}
            label="Principles needed"
          >
            {(items) => <Principles items={items} />}
          </PendingContent>
        </Scene>

        {/* 10 — Structure: IA + flows */}
        <Scene
          id="structure"
          step="09"
          eyebrow="Structure"
          title="How the product was organised"
          density={density}
        >
          <PendingContent
            value={study.informationArchitecture}
            label="Information architecture needed"
          >
            {(nodes) => <IaDiagram nodes={nodes} />}
          </PendingContent>
          <div className="mt-4">
            <PendingContent value={study.userFlows} label="User flows needed">
              {(flows) => <FlowDiagram flows={flows} style={diagram} />}
            </PendingContent>
          </div>
        </Scene>

        {/* 11 — Decisions */}
        <Scene
          id="decisions"
          step="10"
          eyebrow="Product decisions"
          title="The choices that shaped it"
          lede="Each decision below records what was wrong, what else was on the table, what I chose, and what it cost."
          density={density}
          bordered
        >
          <PendingContent
            value={study.interactionDecisions}
            label="Decisions needed"
          >
            {(items) => <DecisionRecords items={items} />}
          </PendingContent>
        </Scene>

        {/* 12 — AI behaviour, where relevant */}
        {study.aiBehaviour !== undefined && (
          <Scene
            id="ai-behaviour"
            step="11"
            eyebrow="AI behaviour"
            title="How the system explains itself"
            lede="Generated output is only useful when a person can judge it. This is the behaviour I designed around that."
            density={density}
          >
            <PendingContent
              value={study.aiBehaviour}
              label="AI behaviour needed"
            >
              {(data) => <AiBehaviourSpec data={data} />}
            </PendingContent>
          </Scene>
        )}

        {/* 13 — Interface walkthrough */}
        <Scene
          id="interface"
          step="12"
          eyebrow="The interface"
          title="What it became"
          density={density}
          bordered
        >
          <div className="mt-10">
            {gallery ? (
              <Gallery items={gallery} />
            ) : (
              <MediaTodo
                note={
                  todoNote(study.gallery) ?? "Interface screens with captions."
                }
                ratio="16/9"
              />
            )}
          </div>

          {study.beforeAfter !== undefined && (
            <div className="mt-14">
              {beforeAfter ? (
                <BeforeAfterView data={beforeAfter} />
              ) : (
                <MediaTodo
                  note={
                    todoNote(study.beforeAfter) ??
                    "Before and after comparison."
                  }
                  ratio="21/9"
                />
              )}
            </div>
          )}
        </Scene>

        {/* 14 — Visual system */}
        <Scene
          id="design-system"
          step="13"
          eyebrow="Visual system"
          title="The system underneath"
          density={density}
        >
          <PendingContent
            value={study.designSystem}
            label="Design system needed"
          >
            {(spec) => <DesignSystemOverview spec={spec} />}
          </PendingContent>
        </Scene>

        {/* 15 — Prototype */}
        <Scene
          id="prototype"
          step="14"
          eyebrow="Prototype"
          title="Seeing it move"
          density={density}
          bordered
        >
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {prototypes ? (
              prototypes.map((video) => (
                <PrototypePlayer key={video.src} video={video} />
              ))
            ) : (
              <MediaTodo
                note={todoNote(study.prototypes) ?? "Prototype recording."}
                ratio="16/10"
                className="lg:col-span-2"
              />
            )}
          </div>
        </Scene>

        {/* 16 — Testing */}
        <Scene
          id="testing"
          step="15"
          eyebrow="Testing"
          title="What users told me"
          density={density}
        >
          <PendingContent value={study.testing} label="Test results needed">
            {(items) => <TestingResults items={items} />}
          </PendingContent>
        </Scene>

        {/* 17 — Development collaboration */}
        <Scene
          id="build"
          step="16"
          eyebrow="Build"
          title="Working with engineering"
          density={density}
          bordered
        >
          <PendingContent
            value={study.developmentCollaboration}
            label="Collaboration notes needed"
          >
            {(items) => <Collaboration items={items} />}
          </PendingContent>
        </Scene>

        {/* 18 — Outcome, metrics, testimonial */}
        <Scene
          id="outcome"
          step="17"
          eyebrow="Outcome"
          title="What changed"
          density={density}
        >
          <PendingContent value={study.outcomes} label="Outcomes needed">
            {(items) => <ProseList items={items} numbered={false} />}
          </PendingContent>

          <PendingContent value={study.metrics} label="Metrics needed">
            {(items) => <Metrics items={items} />}
          </PendingContent>

          <PendingContent value={study.testimonial} label="Testimonial needed">
            {(quote) => <TestimonialBlock quote={quote} />}
          </PendingContent>
        </Scene>

        {/* 19 — Lessons */}
        <Scene
          id="lessons"
          step="18"
          eyebrow="Lessons"
          title="What I'd do differently"
          density={density}
          bordered
        >
          <PendingContent value={study.lessons} label="Lessons needed">
            {(items) => <ProseList items={items} />}
          </PendingContent>
        </Scene>
      </article>

      {/* 20 — Next project */}
      <NextProject previous={previous} next={next} />
    </div>
  );
}
