import { Button } from 'antd'
import { useMemo, useState } from 'react'
import DomainItem from './DomainItem'

type SectionItemProps = {
  section: SectionType,
  seq: number,
  update: (section: SectionType, seq: number) => void,
}

const SectionItem: React.FC<SectionItemProps> = (props) => {

  const [domainId, setDomainId] = useState(Date.now())

  const calculateTotalProportion = (domains: DomainType[]) => {
    return domains.reduce((pre, cur) => pre + cur.proportion, 0)
  }
  const currentTotalProportion = useMemo(() => calculateTotalProportion(props.section.domains), [props.section.domains])

  const updateSectionInfo = (key: string, value: any) => {
    switch (key) {
      case 'domains':
        const { domain, seq } = value
        props.section.domains[seq - 1] = domain
        break
    }
    props.update(props.section, props.seq)
  }

  const deleteDomain = (seq: number) => {
    if (seq == undefined) return
    props.section.domains.splice(seq - 1, 1)
    for (let index = seq - 1; index < props.section.domains.length; index++) {
      props.section.domains[index].seq--
    }
    props.update(props.section, props.seq)
  }

  const addNewDomain = () => {
    const domain = {
      domainName: 'new domain',
      proportion: Math.max(100 - currentTotalProportion, 0),
      seq: props.section.domains.length + 1,
      id: domainId,
      parts: [],
    }
    setDomainId(domainId + 1)
    props.section.domains = [...props.section.domains, domain]
    props.update(props.section, props.seq)
  }

  const domainList = props.section.domains?.map((domain: DomainType, index: number) => (
    <DomainItem
      key={domain.id}
      domain={domain}
      update={(domain: DomainType, seq: number) => updateSectionInfo('domains', { domain, seq })}
      deleteDomain={deleteDomain}
    />
  ))
  
  return (
    <div className='admin-section-container'>
      <div className='section-title'> { props.section.title } </div>
      <div className='add-domain-container'>
        <div className='section-divider'> Domain Count: {props.section.domains.length} &nbsp;&nbsp;&nbsp;
          Domain Proportion: &nbsp;
          <span className={currentTotalProportion == 100 ? 'ok' : 'error'}>
            { currentTotalProportion } %
            { currentTotalProportion == 100 ? '' : ' Please Adjust Proportion!'}
          </span>{}
        </div>
        <div className='domain-list'>
          { domainList }
        </div>
        <Button onClick={addNewDomain}> Add Domain </Button>
      </div>
    </div>
  )
}

export default SectionItem