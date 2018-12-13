import React from 'react';
import * as utils from './utils';

export default function NotFound({ location }) {
  return (
    <div id="page-404">
      <section>
        <h1>404</h1>
        <p>
          你要找的页面不存在
          <a href={utils.getLocalizedPathname('/', utils.isZhCN(location.pathname))}>
            返回首页
          </a>
        </p>
      </section>
      <style
        dangerouslySetInnerHTML={{
          __html: '#react-content { height: 100%; background-color: #fff }',
        }}
      />
    </div>
  );
}
