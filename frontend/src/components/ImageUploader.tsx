
import { Ref, useRef, useState } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import { errorMessage } from '@/utils'
import './ImageUploader.less'

type ImageUploaderProps = {
  maxImgCount: number,
  resize?: () => void,
  setImgList: (data: File[]) => void,
}

type ImageDataUrl = {
  id: number,
  dataUrl: string,
}

const ImageUploader: React.FC<ImageUploaderProps> = (props) => {

  const imgRef = useRef<any>()
  const [imgList, setImgList] = useState<File[]>([])
  const [dataUrlList, setDataUrlList] = useState<ImageDataUrl[]>([])
  const [currentImgCount, setCurrentImgCount] = useState<number>(0)

  const onImgChange = (e: any) => {
    const files = e.target.files
    let list: File[] = []
    let url: ImageDataUrl[] = []

    if (files.length > props.maxImgCount) {
      errorMessage(`Only ${props.maxImgCount} images can be added.`)
      return
    }
    setCurrentImgCount(0)
    setImgList(list)
    setDataUrlList(url)
    for (let i = 0; i < files.length && i < props.maxImgCount; i++) {
      const file = files[i]
      list = [...list, file]
      setImgList(list)
      const reader = new FileReader()
      reader.onload = (e: any) => {
        const dataUrl = e.target.result
        url = [...url, { id: i, dataUrl }]
        setDataUrlList(url)
        props.resize && props.resize()
      }
      reader.readAsDataURL(file)
      setCurrentImgCount(currentImgCount + 1)
    }
    props.setImgList(list)
  }

  const removeImage = (id: number) => {
    const list = imgList.filter((img, index) => index != id)
    setImgList(list)
    setDataUrlList(dataUrlList.filter(url => url.id != id))
    props.setImgList(list)
  }
  
  return (
    <div className='image-uploader-container'>
      <input
        type='file'
        ref={imgRef}
        accept='image/jpeg, image/jpg, image/png'
        className='img-input'
        multiple={props.maxImgCount > 1}
        onInput={onImgChange}
      />
      <div className='preview'>
        {
          dataUrlList?.map((url, index) => (
            <div className='preview-container' key={url.id}>
              <img src={url.dataUrl} alt='preview' />
              <CloseCircleOutlined onClick={() => removeImage(url.id)} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ImageUploader