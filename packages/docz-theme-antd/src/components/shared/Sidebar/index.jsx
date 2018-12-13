import React from 'react';
import { Menu } from 'antd';
import { Docs, Link } from 'docz'

export default class extends React.PureComponent{
    getMenuItems(docs) {
        return docs.map(item => (
            <Menu.Item key={item.id}>
                <Link to={item.route}>{item.name}</Link>
            </Menu.Item>
        ));
    }

    render() {
        const { active, parent } = this.props

        return (
            <Docs>
                {
                    ({docs: allDocs }) => {
                        const docs = allDocs.filter(doc => doc.parent === parent);
                        const { id: selectedKey } = allDocs.find(doc => doc.route === active);
                        const menuItems = this.getMenuItems(docs);

                        return (
                            <Menu
                              inlineIndent="54"
                              className="aside-container"
                              mode="inline"
                              selectedKeys={[selectedKey]}
                            >
                              {menuItems}
                            </Menu>
                        );
                    }
                }
            </Docs>
        );
    }
}