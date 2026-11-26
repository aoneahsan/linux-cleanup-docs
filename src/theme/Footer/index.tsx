import React from 'react';
import Footer from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import type { WrapperProps } from '@docusaurus/types';
import EcosystemShowcase from '@site/src/components/ecosystem/EcosystemShowcase';

type Props = WrapperProps<typeof FooterType>;

/** "More from Zaions" sits before the footer on every docs page (aoneahsan-cccs-ecosystem-showcase). */
export default function FooterWrapper(props: Props): React.JSX.Element {
  return (
    <>
      <EcosystemShowcase />
      <Footer {...props} />
    </>
  );
}
