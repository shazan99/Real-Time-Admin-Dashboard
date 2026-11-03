import { useEffect } from "react"
import { Button, Layout, Space } from "antd"
import { BellOutlined } from "@ant-design/icons"
import CurrentUser from "./current-user"
import { CT_INBOX_SELECTOR, clevertapAskForPush } from "@/utilities/clevertap"

const Header = () => {

  // the header only renders for logged-in users, a good moment to ask for web push
  useEffect(() => {
    clevertapAskForPush()
  }, [])

  const headerStyles: React.CSSProperties = {
    background: '#fff',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 999,
  }
  return (
    <Layout.Header style={headerStyles}>
      <Space align="center" size='middle'>
        {/* CleverTap Web Inbox opens from this element (Inbox selector in the dashboard) */}
        <Button id={CT_INBOX_SELECTOR} type="text" shape="circle" icon={<BellOutlined />} />
        <CurrentUser />
      </Space>
    </Layout.Header>
  )
}

export default Header