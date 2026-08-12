import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './DailyFeedbackChart.css'

function DailyFeedbackTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  const submissions = payload.find((item) => item.dataKey === 'submissions')?.value ?? 0
  const averageEntry = payload.find((item) => item.dataKey === 'averageRating')
  const averageRating = averageEntry?.value

  return (
    <div className="daily-feedback-chart__tooltip">
      <p className="daily-feedback-chart__tooltip-title">{label}</p>
      <p className="daily-feedback-chart__tooltip-row">
        Submissions: <strong>{submissions}</strong>
      </p>
      <p className="daily-feedback-chart__tooltip-row">
        Average rating:{' '}
        <strong>{averageRating != null ? `${averageRating}/5` : '—'}</strong>
      </p>
    </div>
  )
}

function DailyFeedbackChart({ dailyData }) {
  if (!dailyData.length) {
    return null
  }

  const chartData = dailyData.map((day) => ({
    label: day.label,
    submissions: day.submissions,
    averageRating:
      day.averageRating != null ? Math.round(day.averageRating * 10) / 10 : null,
  }))

  return (
    <div className="insights-chart daily-feedback-chart">
      <div className="insights-chart__header">
        <div className="insights-chart__title-wrap">
          <span className="insights-chart__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 18V6M10 18V10M16 18V8M22 18V4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <h3 className="insights-chart__title">Daily feedback trends</h3>
            <p className="insights-chart__subtitle">
              Blue bars = submissions each day · Red line = average rating (0–5)
            </p>
          </div>
        </div>
      </div>

      <div className="daily-feedback-chart__canvas">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#71717a', fontSize: 12 }}
              axisLine={{ stroke: '#d4d4d8' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="submissions"
              allowDecimals={false}
              tick={{ fill: '#6366f1', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Submissions',
                angle: -90,
                position: 'insideLeft',
                fill: '#6366f1',
                fontSize: 12,
                fontWeight: 600,
                offset: 12,
              }}
            />
            <YAxis
              yAxisId="rating"
              orientation="right"
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fill: '#e11d48', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Avg rating',
                angle: 90,
                position: 'insideRight',
                fill: '#e11d48',
                fontSize: 12,
                fontWeight: 600,
                offset: 12,
              }}
            />
            <Tooltip content={<DailyFeedbackTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) =>
                value === 'submissions' ? 'Daily submissions' : 'Daily average rating'
              }
            />
            <Bar
              yAxisId="submissions"
              dataKey="submissions"
              name="submissions"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <Line
              yAxisId="rating"
              type="monotone"
              dataKey="averageRating"
              name="averageRating"
              stroke="#e11d48"
              strokeWidth={3}
              dot={{ r: 4, fill: '#ffffff', stroke: '#e11d48', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DailyFeedbackChart
