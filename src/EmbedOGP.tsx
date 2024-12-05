import Async from 'react-async';

import './EmbedOGP.css';

const OGP_API = 'https://ogp-scanner.kunon.jp/v1/ogp_info';
const PLACEHOLDER_IMAGE = 'https://placehold.jp/24/5C9A29/ffffff/480x360.png';

const getOGP = async({ href }: any) => {
  const res = await fetch(`${OGP_API}?url=${encodeURIComponent(href)}`);
  const json = await res.json();
  return json;
};

export const EmbedOGP = (A: React.FunctionComponent<any>): React.FunctionComponent<any> => {
  return ({ children, href, ...props }) => {
    try {
      console.log({ children, href, props });
      if (children === null || children !== 'OGP') {
        return (<A href={href} {...props}>{children}</A>);
      }
      return (
        <Async promiseFn={getOGP} href={href}>
          {({ data, error, isPending }) => {
            if (isPending) return 'Loading...';
            if (error) return `Something went wrong: ${error.message}`;
            if (data) {
              return (
                <div className='row ogp'>
                  <div className='col-3'>
                    <a href={href} target='_blank' rel='noopener noreferrer'>
                      <img
                        src={data.ogp['og:image'] || PLACEHOLDER_IMAGE}
                        alt={data.html.title}
                      />
                    </a>
                  </div>
                  <div className='col-9'>
                    <a href={href} target='_blank' rel='noopener noreferrer'>
                      <strong>{data.html.title}</strong>
                    </a>
                    <p>
                      { data.html.description || data.ogp['og:description'].join('') }
                    </p>
                    { data.ogp['og:site_name'] && (
                      <div
                        style={{
                          color: '#777',
                        }}
                      >
                        {data.ogp['og:site_name']}
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          }}
        </Async>
      );
    }
    catch (err) {
      return (<A href={href} {...props}>{children}</A>);
    }
  };
};
