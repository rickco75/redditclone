import React from 'react';
import { NavBar } from './NavBar';
import { WraperVariant, Wrapper } from './Wrapper';

interface LayoutProps {
	variant?: WraperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
	return (
		<>
			<NavBar />
			<Wrapper variant={variant}>{children}</Wrapper>
		</>
	);
};
