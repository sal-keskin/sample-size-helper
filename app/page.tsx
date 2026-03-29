'use client';

import { useTranslation } from '@/lib/i18n';
import { ChoiceCard } from '@/components/ChoiceCard';

// Font Awesome 4 icons for homepage cards
const icons = {
  help: <i className="fa fa-compass fa-lg" />,
  prevalence: <i className="fa fa-pie-chart fa-lg" />,
  compare: <i className="fa fa-exchange fa-lg" />,
  predictors: <i className="fa fa-sitemap fa-lg" />,
  data: <i className="fa fa-database fa-lg" />,
};

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Hero */}
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 leading-tight mb-3">
          {t.home.hero}
        </h1>
        <p className="text-base sm:text-lg text-stone-500 leading-relaxed max-w-xl mx-auto">
          {t.home.heroSub}
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-3 animate-fadeIn">
        <ChoiceCard
          title={t.home.card1Title}
          description={t.home.card1Desc}
          href="/wizard"
          icon={icons.help}
        />
        <ChoiceCard
          title={t.home.card2Title}
          description={t.home.card2Desc}
          href="/calc/prevalence"
          icon={icons.prevalence}
        />
        <ChoiceCard
          title={t.home.card3Title}
          description={t.home.card3Desc}
          href="/wizard?step=compare"
          icon={icons.compare}
        />
        <ChoiceCard
          title={t.home.card4Title}
          description={t.home.card4Desc}
          href="/calc/predictors"
          icon={icons.predictors}
        />
        <ChoiceCard
          title={t.home.card5Title}
          description={t.home.card5Desc}
          href="/calc/already-have-data"
          icon={icons.data}
        />
      </div>
    </div>
  );
}
