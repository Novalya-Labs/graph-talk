export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-2">
      <p className="text-xs text-muted-foreground text-center">
        Graph Talk. Made by{' '}
        <a
          href="https://linkedin.com/in/enzo-candotti"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-black dark:hover:text-white"
        >
          Novalya Labs
        </a>
      </p>
    </footer>
  );
};
