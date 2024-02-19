import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
// hooks
import useActiveLink from '../../../hooks/useActiveLink';
//
import { StyledPopover } from './styles';
import NavItem from './NavItem';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavList.propTypes = {
	data: PropTypes.object,
	depth: PropTypes.number,
	hasChild: PropTypes.bool,
};

export default function NavList({ data, depth, hasChild }) {
	const navRef = useRef(null);

	const { pathname } = useRouter();

	const active = useActiveLink(data.path, hasChild);

	const externalLink = data.path.includes('http');

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) {
			handleClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	useEffect(() => {
		const appBarEl = Array.from(document.querySelectorAll('.MuiAppBar-root'));

		// Reset styles when hover
		const styles = () => {
			document.body.style.overflow = '';
			document.body.style.padding = '';
			// Apply for Window
			appBarEl.forEach((elem) => {
				elem.style.padding = '';
			});
		};

		if (open) {
			styles();
		} else {
			styles();
		}
	}, [open]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<NavItem ref={navRef} item={data} depth={depth} open={open} active={active} isExternalLink={externalLink} onMouseEnter={handleOpen} onMouseLeave={handleClose} />

			{hasChild && (
				<StyledPopover
					open={open}
					anchorEl={navRef.current}
					anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
					transformOrigin={{ vertical: 'center', horizontal: 'left' }}
					PaperProps={{
						onMouseEnter: handleOpen,
						onMouseLeave: handleClose,
					}}
				>
					<NavSubList data={data.children} depth={depth} />
				</StyledPopover>
			)}
		</>
	);
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavSubList.propTypes = {
	data: PropTypes.array,
	depth: PropTypes.number,
};

function NavSubList({ data, depth }) {
	return (
		<>
			{data.map((list) => (
				<NavList key={list.title + list.path} data={list} depth={depth + 1} hasChild={!!list.children} />
			))}
		</>
	);
}
