import CustomAvatar from '@/components/custom-avatar'
import { Text } from '@/components/text'
import { TextIcon } from '@/components/text-icon'
import { User } from '@/graphql/schema.types'
import { getDateColor } from '@/utilities/utilities'
import { ClockCircleOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons'
import { Button, Card, ConfigProvider, Dropdown, MenuProps, Space, Tag, theme, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { memo, useMemo } from 'react'

type ProjectCardProps = {
    id: string,
    title: string,
    updatedAt: string,
    dueDate?: string,
    users?: {
        id: string,
        name: string,
        avatarUrl?: User['avatarUrl'],
    }[]
}
const ProjectCard = ({ id, title, dueDate, users }: ProjectCardProps) => {

    const { token } = theme.useToken();
    const edit = () => {};

    const dropdownItems = useMemo(() => {
        const dropdownItems: MenuProps['items'] = [
            {
                label: 'View Card',
                key: '1',
                icon: <EyeOutlined />,
                onClick: () => {
                    edit()
                }
            },
            {
                danger: true,
                label: 'Delete Card',
                key: '2',
                icon: <DeleteOutlined />,
                onClick: () => {}
            }
        ]

        return dropdownItems
    }, [])

    const dueDateOptions = useMemo(() => {
        if(!dueDate) return null;

        const date = dayjs(dueDate);
        return{
            color: getDateColor({date: dueDate}) as string,
            text: date.format('MMM DD')
        }
    }, [dueDate])

  return (
    <ConfigProvider
        theme={{
            components: {
                Tag: {
                    colorText: token.colorTextSecondary,
                },
                Card: {
                    headerBg: 'transparent',
                }
            }
        }}>
            <Card
                size='small'
                title={<Text ellipsis={{tooltip: title}}>{title}</Text>}
                onClick={() => edit()}
                extra={
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: dropdownItems,
                        }}
                        placement='bottom'
                        arrow={{ pointAtCenter: true }}
                    >
                        <Button 
                            type='text' 
                            shape='circle' 
                            icon={
                                <MoreOutlined 
                                    style={{
                                        transform: 'rotate(90deg)'
                                    }}
                                />
                            }
                            onPointerDown={(e) => {
                                e.stopPropagation()
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        />
                    </Dropdown>
                }
            >
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '8px'
                }}
                >
                    <TextIcon style={{marginRight: '4px'}}/>
                    {dueDateOptions && (
                        <Tag
                            icon={
                                <ClockCircleOutlined style={{fontSize: '12px'}} />
                            }
                            style={{
                                padding: '0 4px',
                                marginInlineEnd: '0',
                                backgroundColor: dueDateOptions.color === 'default' ? 'transparent' : 'unset',
                            }}
                            color={dueDateOptions.color}
                            bordered={dueDateOptions.color !== 'default'}
                        >
                            {dueDateOptions.text}
                        </Tag>
                    )}
                    {!!users?.length && (
                       <Space
                        size={4}
                        wrap
                        direction='horizontal'
                        align = "center"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginLeft: 'auto',
                            marginRight: 0,
                        }}
                    >
                        {users.map((user) => (
                            <Tooltip key={user.id} title={user.name}>
                                <CustomAvatar name={user.name} src={user.avatarUrl} />
                            </Tooltip>
                        ))}
                       </Space> 
                    )}
                </div>
            </Card>
    </ConfigProvider>
  )
}

export default ProjectCard

//to memoise a component when parent elements changes but the card hasn't changed (basically to stop re-render)
export const ProjectCardMemo = memo(ProjectCard, (prev, next) => {
    return(
        prev.id === next.id &&
        prev.title === next.title &&
        prev.dueDate === next.dueDate &&
        prev.users?.length === next.users?.length &&
        prev.updatedAt === next.updatedAt
    )
})