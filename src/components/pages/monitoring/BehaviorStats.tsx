import React from 'react';
import { AlertTriangle, ChevronDown, FileText, Sparkles } from 'lucide-react';
import { BehaviorStatsProps } from '../../../types';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../ui/chart';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { useTranslation } from '../../../lib/i18n';

export default function BehaviorStats({
  timeFilter,
  setTimeFilter,
  summary,
  avgOver3Days,
  statsByTime,
  trendStatsByTime,
  activeCategory,
  totalActivities,
  onGenerateLog,
  isLoading = false,
  error = null,
  placeholder = null,
}: BehaviorStatsProps) {
  const { t } = useTranslation();

  const barChartConfig: ChartConfig = {
    activityCount: { label: t('monitoring.stats.perDay'), color: '#0d9488' },
  };

  const barData = statsByTime.map((item, idx) => ({
    date: item.date,
    activityCount: item.activityCount,
    fill: idx === statsByTime.length - 1 ? '#0d9488' : '#cbd5e1',
  }));

  const pieData = activeCategory.map((cat) => ({
    name: t(cat.label),
    value: cat.value,
    fill: cat.color,
  }));

  const pieChartConfig: ChartConfig = activeCategory.reduce((acc, cat) => {
    acc[t(cat.label)] = { label: t(cat.label), color: cat.color };
    return acc;
  }, {} as ChartConfig);

  const todayStats = statsByTime[statsByTime.length - 1];
  const trendData = trendStatsByTime.slice(-7);

  const lineChartConfig: ChartConfig = {
    restingCount: { label: t('monitoring.behavior.resting'), color: '#94a3b8' },
    eatingCount: { label: t('monitoring.behavior.eating'), color: '#0d9488' },
    drinkingCount: { label: t('monitoring.behavior.drinking'), color: '#10b981' },
    activityCount: { label: t('monitoring.behavior.active'), color: '#f59e0b' },
  };

  return (
    <div id="monitoring-right" className="col-span-1 lg:col-span-4 space-y-6">
      <Card className="p-6 rounded-2xl gap-0">
        <CardContent className="p-0 space-y-12">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Sparkles className="size-4 text-teal-600" />
              <span>{t('monitoring.stats.title')}</span>
            </h4>
            <div className="relative">
              <select
                id="stats-time-filter"
                value={timeFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeFilter(e.target.value as '1' | '3' | '7')}
                className="appearance-none bg-slate-50 rounded-lg px-3 py-1 pr-6 text-[10px] font-extrabold text-slate-500 focus:outline-none cursor-pointer"
              >
                <option value="1">{t('monitoring.stats.filter1Day')}</option>
                <option value="3">{t('monitoring.stats.filter3Days')}</option>
                <option value="7">{t('monitoring.stats.filter7Days')}</option>
              </select>
              <ChevronDown className="size-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/40 rounded-xl text-xs text-slate-600 flex gap-2">
            <span className="text-teal-600 font-bold shrink-0">*</span>
            <span className="font-medium text-slate-600 leading-normal">
              {isLoading ? t('monitoring.placeholders.loadingTelemetry') : error ? error.message : summary}
            </span>
          </div>

          {placeholder ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center space-y-3">
              <AlertTriangle className="size-8 text-amber-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-slate-700">{placeholder.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{placeholder.message}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('monitoring.stats.avgLabel')}</span>
                <div className="bg-slate-50/50 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-0.5">
                      <span className="block text-2xl font-black text-slate-800 tracking-tight">{todayStats?.activityCount ?? 0} <span className="text-[10px] text-slate-400 font-bold">{t('monitoring.stats.perDay')}</span></span>
                      <span className="text-[10px] text-slate-400 font-bold">{t('monitoring.stats.yesterdayAvg')} {avgOver3Days}{t('monitoring.stats.perDay')}</span>
                    </div>
                  </div>
                  <ChartContainer config={barChartConfig} className="h-[100px] w-full">
                    <BarChart data={barData} margin={{ top: 15, right: 0, left: 0, bottom: 0 }}>
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="activityCount" radius={[4, 4, 0, 0]} fill="#0d9488">
                        {barData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>

              <div className="space-y-4">
                <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('monitoring.stats.distributionLabel')}</span>
                <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
                  <ChartContainer config={pieChartConfig} className="size-[100px] shrink-0 lg:w-full lg:h-[120px] xl:size-[100px]">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={28} outerRadius={42} strokeWidth={2}>
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 min-w-0 select-none">
                    {activeCategory.map((cat, idx) => (
                      <div key={idx} className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="size-2.5 rounded-md shrink-0 block" style={{ backgroundColor: cat.color }} />
                          <span className="text-xs font-bold text-slate-600 truncate">{t(cat.label)}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold pl-4 truncate">{cat.value} {t('monitoring.stats.activityPerDay')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('monitoring.stats.comparisonLabel')}</span>
                <ChartContainer config={lineChartConfig} className="h-[120px] w-full">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      label={{ value: t('monitoring.stats.countAxis'), angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="restingCount" stroke="var(--color-restingCount)" strokeWidth={1.75} dot={{ r: 2.5, fill: 'var(--color-restingCount)' }} />
                    <Line type="monotone" dataKey="eatingCount" stroke="var(--color-eatingCount)" strokeWidth={1.75} dot={{ r: 2.5, fill: 'var(--color-eatingCount)' }} />
                    <Line type="monotone" dataKey="drinkingCount" stroke="var(--color-drinkingCount)" strokeWidth={1.75} dot={{ r: 2.5, fill: 'var(--color-drinkingCount)' }} />
                    <Line type="monotone" dataKey="activityCount" stroke="var(--color-activityCount)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-activityCount)' }} />
                  </LineChart>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-bold text-slate-400">
                  {Object.entries(lineChartConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-1 min-w-0">
                      <span className="w-2.5 h-0.5 shrink-0 inline-block" style={{ backgroundColor: config.color }} />
                      <span className="truncate">{config.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button
            id="generate-daily-log-btn"
            onClick={onGenerateLog}
            className="w-full py-3 group"
            disabled={Boolean(placeholder) || totalActivities === 0}
          >
            <FileText className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5" />
            <span>{t('monitoring.stats.generateLog')}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
