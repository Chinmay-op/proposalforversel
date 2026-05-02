import { CoverPage } from './proposal/CoverPage'
import { SectionHeader } from './proposal/SectionHeader'
import { ChallengeCard } from './proposal/ChallengeCard'
import { FeatureCard } from './proposal/FeatureCard'
import { SectionCalloutBox } from './proposal/SectionCalloutBox'
import { NumberedDeliverable } from './proposal/NumberedDeliverable'
import { StatCard } from './proposal/StatCard'
import { QuoteCallout } from './proposal/QuoteCallout'
import { ImagePlaceholder } from './proposal/ImagePlaceholder'
import { TwoColumnGrid } from './proposal/TwoColumnGrid'
import { ThreeColumnGrid } from './proposal/ThreeColumnGrid'
import { WorkflowStep } from './proposal/WorkflowStep'
import { TagBadge } from './proposal/TagBadge'
import { ContactFooter } from './proposal/ContactFooter'
import { DividerStrip } from './proposal/DividerStrip'
import { CredentialCard } from './proposal/CredentialCard'
import { PersonnelCard } from './proposal/PersonnelCard'
import { CompetitorRow } from './proposal/CompetitorRow'
import { PageFooterBar } from './proposal/PageFooterBar'
import { BiometricMiniCard } from './proposal/BiometricMiniCard'
import { LargeQuoteHero } from './proposal/LargeQuoteHero'
import { BulletList } from './proposal/BulletList'
import { DataTable } from './proposal/DataTable'

export const COMPONENT_REGISTRY = {
  CoverPage,
  SectionHeader,
  ChallengeCard,
  FeatureCard,
  SectionCalloutBox,
  NumberedDeliverable,
  StatCard,
  QuoteCallout,
  ImagePlaceholder,
  TwoColumnGrid,
  ThreeColumnGrid,
  WorkflowStep,
  TagBadge,
  ContactFooter,
  DividerStrip,
  CredentialCard,
  PersonnelCard,
  CompetitorRow,
  PageFooterBar,
  BiometricMiniCard,
  LargeQuoteHero,
  BulletList,
  DataTable,
}

// Validation: names the LLM is allowed to use
export const VALID_COMPONENT_NAMES = Object.keys(COMPONENT_REGISTRY)
