import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold text-heading">页面出了点问题</h1>
          <p className="mt-3 text-body">页面加载失败，您可以返回首页或刷新重试。</p>
          <div className="mt-6 flex gap-3">
            <Link to="/" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white">
              返回首页
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md border border-theme px-4 py-2 text-sm font-medium text-body"
            >
              刷新页面
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
