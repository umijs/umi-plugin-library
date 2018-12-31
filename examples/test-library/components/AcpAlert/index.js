import { Alert } from 'antd';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const AlertV = styled(Alert)`
  &.ant-alert {
    line-height: 1.2;
    margin-bottom: 16px;
  }

  & > .ant-alert-icon {
    top: 50%;
    margin-top: -8px;
    line-height: 1.2;
  }

  & > .ant-alert-close-icon {
    line-height: 1.2;
  }
`;

const propTypes = {
  id: PropTypes.string,
  /** 类型 */
  type: PropTypes.string.isRequired,
  /** 消息 */
  message: PropTypes.string.isRequired
}

const AcpAlert = props => {
  const id = `__acp_alert_${props.id}`;
  const close = () => {
    localStorage.setItem(id, true + '');
  };

  const p = {
    ...props,
    showIcon: true,
  };
  if (p.neverShow) {
    if (!props.id) {
      // tslint:disable-next-line:no-console
      console.error('AcpAlert 组件设置 neverShow 时，需设置组件的 id');
      return false;
    }
    const isClose = localStorage.getItem(id) === 'true';
    if (isClose) {
      return null;
    }
    p.closeText = '不再提醒';
  }
  return <AlertV {...p} onClose={() => close()} />;
};

AcpAlert.propTypes = propTypes;

export default AcpAlert;
