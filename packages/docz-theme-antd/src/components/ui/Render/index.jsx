import React, {  Component } from 'react'
import { RenderComponentProps, ThemeConfig } from 'docz'
import { Icon, Tooltip } from 'antd';
import classNames from 'classnames';

export class Render extends Component {
    state = {
        codeExpand: false,
    }

    handleCodeExpand = () => {
      this.setState({ codeExpand: !this.state.codeExpand });
    };
    
    render() {
        const state = this.state;
        const codeExpand = state.codeExpand;
        const codeBoxClass = classNames({
          'code-box': true,
          expand: codeExpand,
        });

        const highlightClass = classNames({
          'highlight-wrapper': true,
          'highlight-wrapper-expand': codeExpand,
        });
        console.log(this.props);
        return (
            <div className="render">
                <section className={codeBoxClass}>
                    <section className="code-box-demo">
                        {
                          typeof this.props.component === 'function' ? this.props.component() : this.props.component
                        }
                    </section>
                    <section className="code-box-meta markdown">
                      <div className="code-box-title">
                      </div>
                      <span>一些介绍</span>
                      <Tooltip title={codeExpand ? 'Hide Code' : 'Show Code'}>
                        <span className="code-expand-icon">
                          <img
                            alt="expand code"
                            src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
                            className={codeExpand ? 'code-expand-icon-hide' : 'code-expand-icon-show'}
                            onClick={this.handleCodeExpand}
                          />
                          <img
                            alt="expand code"
                            src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg"
                            className={codeExpand ? 'code-expand-icon-show' : 'code-expand-icon-hide'}
                            onClick={this.handleCodeExpand}
                          />
                        </span>
                      </Tooltip>
                    </section>
                    <section className={highlightClass} key="code">
                      <div className="highlight">
                        <pre class="language-jsx">
                            <code>
                                {this.props.code}
                            </code>
                        </pre>
                      </div>
                    </section>
                </section>
                
                
            </div>
        );
    }
}
