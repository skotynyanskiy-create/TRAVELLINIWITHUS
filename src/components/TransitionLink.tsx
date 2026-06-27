import { forwardRef, type MouseEvent } from 'react';
import {
  Link as RouterLink,
  type LinkProps,
  useHref,
  useLocation,
  useNavigate,
} from 'react-router-dom';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    onClick,
    preventScrollReset,
    relative,
    reloadDocument,
    replace,
    state,
    target,
    to,
    viewTransition = true,
    ...props
  },
  ref
) {
  const href = useHref(to, { relative });
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      !viewTransition ||
      reloadDocument ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      (target && target !== '_self') ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const nextUrl = new URL(href, window.location.href);
    if (nextUrl.origin !== window.location.origin) return;

    event.preventDefault();
    const currentPath = location.pathname + location.search + location.hash;
    const nextPath = nextUrl.pathname + nextUrl.search + nextUrl.hash;

    document.startViewTransition(() => {
      navigate(to, {
        preventScrollReset,
        relative,
        replace: replace ?? currentPath === nextPath,
        state,
      });
    });
  };

  return (
    <RouterLink
      ref={ref}
      onClick={handleClick}
      preventScrollReset={preventScrollReset}
      relative={relative}
      reloadDocument={reloadDocument}
      replace={replace}
      state={state}
      target={target}
      to={to}
      viewTransition={viewTransition}
      {...props}
    />
  );
});
