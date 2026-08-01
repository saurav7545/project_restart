import { Component } from 'react';

/** Keeps one faulty page from taking down the whole application shell. */
export default class PageErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Page render failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="page-error" role="alert">
          <h2>This page could not be loaded.</h2>
          <p>Please refresh the page. Your data is safe.</p>
          <button type="button" onClick={() => window.location.reload()}>Refresh page</button>
        </section>
      );
    }

    return this.props.children;
  }
}
