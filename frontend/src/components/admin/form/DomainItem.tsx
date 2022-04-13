import { InputNumber, Input, Button } from 'antd'
import { useState } from 'react'
import { Domain, Part, SeqType } from '../../../vite-env'
import PartItem from './PartItem'
import Sequence from './Sequence'
import { UnorderedListOutlined } from '@ant-design/icons'

type DomainItemProps = {
  // key: number,
  domain: Domain,
  deleteDomain: (seq: number) => void,
  update: (domain: Domain, seq: number) => void,
}

const DomainItem: React.FC<DomainItemProps> = (props) => {
  const [seqType, setSeqType] = useState(('plain') as SeqType)
  const [partId, setPartId] = useState(Date.now())
  const [partsCollapsed, setPartsCollapsed] = useState(false)
  
  const updateDomainInfo = (value: any, key: string) => {
    const newDomain = props.domain
    switch (key) {
      case 'domainName':
        newDomain.domainName = value
        break
      case 'proportion':
        newDomain.proportion = value
        break
      case 'part':
        newDomain.parts = props.domain.parts.map((part: any) => part.seq == value.seq ? value.part : part)
        break
    }
    props.update(newDomain, props.domain.seq)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const setSequence = (seq: number) => { }

  const addNewPart = () => {
    const { parts } = props.domain
    const part: Part = {
      partName: 'new part',
      id: partId,
      seq: props.domain.parts.length + 1,
      choices: [],
      recommendations: [],
    }
    setPartId(partId + 1)
    parts.push(part)
    props.update(props.domain, props.domain.seq)
  }

  const deletePart = (seq: number) => {
    const { parts } = props.domain
    parts.splice(seq - 1, 1)
    for (let index = seq - 1; index < parts.length; index++) {
      parts[index].seq--
    }
    props.update(props.domain, props.domain.seq)
  }

  const switchPartsHeight = () => {
    setPartsCollapsed(!partsCollapsed)
  }

  const partList = props.domain?.parts?.map((part: Part, index: number) => (
    <PartItem
      key={part.id}
      part={part}
      seqType={seqType}
      update={(part, seq) => updateDomainInfo({ part, seq }, 'part')}
      deletePart={deletePart}
    />
  )) || []

  return (
    <div className={`admin-domain-container ${partsCollapsed ? 'collapsed' : 'expanded'}`}>
      <Sequence type={seqType} seq={props.domain.seq} setSequence={setSequence} />
      <div className='domain-content'>
        <div className='input-item'>
          <div className='label'>
            Domain Name:
          </div>
          <div className='input-wrapper'>
            <Input placeholder='My Quiz' defaultValue={props.domain.domainName} onInput={(e: any) => updateDomainInfo(e.target.value, 'domainName')} />
          </div>
          <Button danger className='delete-btn' onClick={() => props.deleteDomain(props.domain.seq)}>Delete</Button>
        </div>
        <div className='input-item'>
          <div className='label'>
            Domain Proportion:
          </div>
          <div className='input-wrapper'>
            <InputNumber defaultValue={props.domain.proportion} min={0} max={100} onChange={(e: any) => updateDomainInfo(Number(e), 'proportion')} />
          </div>
        </div>
        <div className='section-divider clickable' onClick={switchPartsHeight}>
          Parts: { props.domain.parts.length } <UnorderedListOutlined />
        </div>
        { partList }
        <Button onClick={addNewPart}> Add Part </Button>
      </div>
    </div>
  )
}

export default DomainItem