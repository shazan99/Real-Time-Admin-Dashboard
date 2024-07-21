import { Avatar as AntdAvatar, AvatarProps } from "antd"


type Props = AvatarProps & {
    name?: String
}
const CustomAvatar = ({ name, style, ...rest}: Props) => {
  return (
    <AntdAvatar 
    alt={'John Doe'} 
    size="small" 
    style={{ 
        backgroundColor: '#87d068',
        display:'flex', 
        alignItems: 'center', 
        border:'none',
        ...style
        }}
        {...rest}
    >
        {name}
    </AntdAvatar>
  )
}

export default CustomAvatar