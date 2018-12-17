import * as React from 'react';
import Sidebar from '../shared/Sidebar';
import { Row, Col } from 'antd';

export function Page({ children, doc, match, ...restProps }) {
    const { parent, sidebar, fullpage, noflex } = doc;

    if(sidebar) {
        return (
            <div className="main-wrapper">
                <Row>
                    <Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24} className="main-menu">
                        <Sidebar active={match.url} parent={parent}>
                          {children}
                        </Sidebar>
                    </Col>
                    <Col xxl={20} xl={19} lg={18} md={24} sm={24} xs={24} className="main-container main-container-component">
                        <article className="markdown">
                            <h1>{doc.name}</h1>
                            {children}
                        </article>
                    </Col>
                </Row>
            </div>
        );
    }
    return (
        <div className="wrapper">
            {children}
        </div>
    );
}