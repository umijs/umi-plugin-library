
import * as React from 'react'
import { theme, ThemeConfig, DocPreview } from 'docz'
import { ThemeProvider } from 'emotion-theming'
import { config } from './config'
import Layout from './components/shared/Layout/index'
import * as components from './components/ui';
import 'antd/dist/antd.css';
import './styles/style';

const Theme = () => (
  <ThemeConfig>
    {config => (
      <ThemeProvider theme={{...config.themeConfig}}>
        <Layout location={window.location}>
          <DocPreview
              components={{
                page: components.Page,
                pre: components.Pre,
                render: components.Render
              }}
            />
        </Layout>
      </ThemeProvider>
    )}
  </ThemeConfig>
)

export default theme(config)(Theme)
