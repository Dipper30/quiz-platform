import { lazy, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import './Result.less'

type EChartsOption = echarts.EChartsOption

type Recommendation = {
  id: number,
  link: string,
  show_under: number,
}

type ResultProps = {
  
}

const Result: React.FC<ResultProps> = (props) => {

  const result = useSelector((state: any) => state.result.data) 
  const loading = useSelector((state: any) => state.result.loading) 
  const [radarChart, setRadarChart] = useState<any>(null)
  const [chartOptions, setChartOptions] = useState<EChartsOption | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !result) {
      navigate('/')
      return
    }
    import('echarts').then(res => {
      const chart = res.init(document.getElementById('radar') as HTMLElement)
      setRadarChart(chart)
    })
  }, [])

  useEffect(() => {
    if (!loading && !result) {
      navigate('/')
      return
    }
    if (!result || !result.sections) return
    const scores = result.sections.map((section: any) => {
      return {
        name: section.title,
        value: section.score,
      }
    })
    const indicator : any = []
    const values: number[] = []
    for (const score of scores) {
      indicator.push({ name: score.name, max: 100, color: '#333' })
      values.push(Math.round(score.value))
    }
    const option: EChartsOption = {
      radar: {
        indicator,
      },
      series: [
        {
          type: 'radar',
          data: [ { value: values }],
          label: {
            show: true,
          },
        },
      ],
    }
    
    const rec = []
    for (const section of result.sections) {
      for (const domain of section.domains) {
        for (const part of domain.parts) {
          const { score, recommendations, totalPoints } = part
          for (const r of recommendations) {
            if (totalPoints && ((score / totalPoints) <= (r.show_under / 100))) {
              rec.push(r)
              break
            }
          }
        }
      }
    }
    setChartOptions(option)
    setRecommendations(rec)
  }, [result])

  useEffect(() => {
    (chartOptions && radarChart) && radarChart.setOption(chartOptions)
  }, [chartOptions, radarChart])

  const directTo = (link: string) => {
    window.open(link, '_blank')
  }

  return (
    <div className='result-container'>
      <div className='gap' />
      <p className='bold-text'> Congratulations! You Made it! </p>
      <p className='text'> Your Overall OGD Literacy Score is </p>
      <div className='score'>
        { loading ? 'Calculating...' : (
          result?.overallScore ? Math.round(100 + 15 * Number(result.overallScore)) : 100
          ) }
      </div>
      <span className='divider'></span>
      <p className='text'> Your Score in Each Pivot </p>
      <div id='radar'>
        Rendering Radar E-Chart...
      </div>
      <span className='divider'></span>
      <p className='text'> Relevant resources that might be helpful</p>
      <div className='recommendation-list'>
        { recommendations && recommendations.map(r => <div onClick={() => directTo(r.link)} key={r.id}> { r.link } </div>) }
      </div>
      <span className='divider'></span>
      <p className='bold-text'> Thank You! </p>
    </div>
  )
}

export default Result