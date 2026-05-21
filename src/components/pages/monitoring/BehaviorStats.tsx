import React from 'react';
import { ChevronDown, Sparkles, CheckCircle2, FileText } from 'lucide-react';
import { ActivityCount, StatByTime, BehaviorStatsProps } from '../../../types';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
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
  activeCategory,
  totalActivities,
  onGenerateLog
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

  const lineData = [
    { name: t('monitoring.clips.active'), today: 6, yesterday: 5 },
    { name: t('monitoring.clips.eat'), today: 2, yesterday: 1 },
    { name: t('monitoring.clips.drink'), today: 1, yesterday: 2 },
  ];

  const lineChartConfig: ChartConfig = {
    today: { label: t('monitoring.stats.today'), color: '#0d9488' },
    yesterday: { label: t('monitoring.stats.yesterday'), color: '#94a3b8' },
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
                onChange={(e: any) => setTimeFilter(e.target.value)}
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
            <span className="font-medium text-slate-600 leading-normal">{summary}</span>
          </div>

          {/* Bar Chart - Activity over 3 days */}
          <div className="space-y-3">
            <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('monitoring.stats.avgLabel')}</span>
            <div className="bg-slate-50/50 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <span className="block text-2xl font-black text-slate-800 tracking-tight">{statsByTime[2]?.activityCount} <span className="text-[10px] text-slate-400 font-bold">{t('monitoring.stats.perDay')}</span></span>
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

          {/* Pie/Donut Chart - Behavior distribution */}
          <div className="space-y-4">
            <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('monitoring.stats.distributionLabel')}</span>
            <div className="flex items-center justify-between gap-4">
              <ChartContainer config={pieChartConfig} className="size-[100px] shrink-0">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={28} outerRadius={42} strokeWidth={2}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 shrink-0 select-none">
                {activeCategory.map((cat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-md shrink-0 block" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-bold text-slate-600">{t(cat.label)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold pl-4">{cat.value} {t('monitoring.stats.activityPerDay')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line Chart - Comparing today vs yesterday */}
          <div className="space-y-4">
            <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('monitoring.stats.comparisonLabel')}</span>
            <ChartContainer config={lineChartConfig} className="h-[120px] w-full">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="yesterday" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3, fill: '#94a3b8' }} />
                <Line type="monotone" dataKey="today" stroke="#0d9488" strokeWidth={2} dot={{ r: 4, fill: '#0d9488' }} />
              </LineChart>
            </ChartContainer>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 justify-end">
              <div className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-slate-300 inline-block" />
                <span>{t('monitoring.stats.yesterday')}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-teal-600 inline-block" />
                <span className="text-teal-600">{t('monitoring.stats.today')}</span>
              </div>
            </div>
          </div>

          {/* Abnormal status indicator */}
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
            <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <span className="block font-bold text-slate-700">{t('monitoring.stats.noAbnormalTitle')}</span>
              <span className="font-medium text-slate-400">{t('monitoring.stats.noAbnormalDesc')}</span>
            </div>
          </div>

          {/* Exercise note */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wide">{t('monitoring.stats.exerciseLabel')}</span>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-green-50/50 p-3 rounded-xl border">
              {t('monitoring.stats.exerciseDetail')}
            </p>
          </div>

          {/* Generate log button */}
          <Button
            id="generate-daily-log-btn"
            onClick={onGenerateLog}
            className="w-full py-3 group"
          >
            <FileText className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5" />
            <span>{t('monitoring.stats.generateLog')}</span>
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}