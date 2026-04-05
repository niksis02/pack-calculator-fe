export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">About Pack Calculator</h1>

      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-3">Architecture</h2>
        <p className="text-gray-700 leading-relaxed">
          Pack Calculator is a full-stack application consisting of a React single-page application
          served by Nginx and a Go REST API powered by the Fiber framework. The frontend
          communicates with the backend over a versioned HTTP API (
          <code className="bg-gray-100 px-1 rounded">/api/v1</code>). All pack configuration is held
          in the backend's in-memory state, protected by a read/write mutex for concurrent safety.
          The UI is fully mobile-responsive, adapting to any screen size via TailwindCSS.
        </p>
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono text-gray-700 space-y-1">
          <div>Browser → Nginx → React SPA</div>
          <div className="pl-6">↕ (API calls)</div>
          <div>Browser → Go Fiber API</div>
          <div className="pl-6">↕ (in-memory)</div>
          <div>Pack config &amp; DP algorithm</div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-3">Tech Stack</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-blue-700">Layer</th>
                <th className="px-4 py-2 text-left font-semibold text-blue-700">Technology</th>
                <th className="px-4 py-2 text-left font-semibold text-blue-700">Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['Backend', 'Go', '1.26'],
                ['Backend', 'Fiber', '3'],
                ['Backend', 'Testify', '1'],
                ['Frontend', 'React', '19'],
                ['Frontend', 'TypeScript', '5'],
                ['Frontend', 'Vite', '8'],
                ['Frontend', 'TailwindCSS', '4'],
                ['Frontend', 'TanStack Query', '5'],
                ['Frontend', 'React Router', '7'],
                ['Frontend', 'Axios', '1'],
                ['Frontend', 'Vitest + MSW', '4 / 2'],
                ['Infra', 'Docker', 'multi-stage'],
                ['Infra', 'AWS ECR + ECS', 'Fargate'],
                ['CI/CD', 'GitHub Actions', '-'],
              ].map(([layer, tech, version]) => (
                <tr key={`${layer}-${tech}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{layer}</td>
                  <td className="px-4 py-2 font-medium text-gray-800">{tech}</td>
                  <td className="px-4 py-2 text-gray-600">{version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-3">Algorithm</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          The pack selection problem is a variant of the unbounded knapsack / coin-change problem
          with two objectives: <strong>minimise total items shipped</strong> (primary) and{' '}
          <strong>minimise number of packs</strong> (secondary tie-breaker). A greedy approach
          cannot guarantee the global optimum, so a dynamic programming solution is used.
        </p>
        <div className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs font-mono overflow-x-auto space-y-1">
          <div>upper = order + max(packSizes)</div>
          <div>dp[q] = min packs to make exactly q items (-1 = unreachable)</div>
          <div>dp[0] = 0</div>
          <div className="mt-2">for q in 1..upper:</div>
          <div className="pl-4">for p in sortedPacks:</div>
          <div className="pl-8">if dp[q-p] != unreachable:</div>
          <div className="pl-12">dp[q] = min(dp[q], dp[q-p] + 1)</div>
          <div className="mt-2">answer = first reachable q &gt;= order</div>
        </div>
        <p className="mt-3 text-gray-700 leading-relaxed">
          Time complexity: <strong>O(order × K)</strong> where K is the number of pack sizes. Space:{' '}
          <strong>O(order)</strong>. For the default configuration (packs up to 5000, order up to
          1M), the DP table is around 8MB — well within normal limits.
        </p>
        <div className="mt-3 bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
          <strong>Example</strong>: packs = [250, 500, 1000, 2000, 5000], order = 12001
          <br />→ Total shipped: <strong>12250</strong> (2×5000 + 1×2000 + 1×250, 4 packs)
          <br />A greedy approach would yield a suboptimal result.
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-3">CI/CD Pipeline</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          Frontend and backend live in separate GitHub repositories, each with its own GitHub
          Actions workflows. CI checks run on every pull request; the deploy pipeline triggers on
          every push to <code className="bg-gray-100 px-1 rounded">main</code>, building, testing,
          packaging to Docker, and rolling out to ECS.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Backend',
              steps: [
                'go mod tidy',
                'golangci-lint',
                'go build',
                'go test -cover',
                'docker build',
                'ECR push',
                'ECS deploy',
              ],
            },
            {
              title: 'Frontend',
              steps: [
                'npm ci',
                'tsc --noEmit',
                'eslint',
                'prettier check',
                'vitest run',
                'vite build',
                'docker build',
                'ECR push',
                'ECS deploy',
              ],
            },
          ].map(({ title, steps }) => (
            <div key={title} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
              <ol className="space-y-1 text-sm text-gray-600">
                {steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="text-blue-500 font-mono text-xs mt-0.5">{i + 1}.</span>
                    <code className="bg-white border border-gray-200 px-1 rounded text-xs">
                      {step}
                    </code>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-3">Repositories</h2>
        <div className="space-y-3">
          {[
            {
              name: 'Frontend',
              url: 'https://github.com/niksis02/pack-calculator-fe',
              description: 'React SPA — the user-facing calculator and pack size configuration UI.',
            },
            {
              name: 'Backend',
              url: 'https://github.com/niksis02/pack-calculator-be',
              description:
                'Go REST API — exposes /api/v1 endpoints for managing pack configuration and running order calculations.',
            },
            {
              name: 'Setup',
              url: 'https://github.com/niksis02/pack-calculator-setup',
              description:
                'Docker Compose setup — clones both repos and wires them into a single local stack. One script, one command, everything running.',
            },
          ].map(({ name, url, description }) => (
            <div key={name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-700 hover:underline"
              >
                {name}
              </a>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-3">Deployment</h2>
        <p className="text-gray-700 leading-relaxed">
          Both services are containerised with multi-stage Docker builds and pushed to{' '}
          <strong>AWS ECR</strong> on every merge to{' '}
          <code className="bg-gray-100 px-1 rounded">main</code>. The CI pipeline then updates the
          ECS task definition with the new image tag and triggers a rolling deployment on{' '}
          <strong>AWS ECS Fargate</strong>, waiting for service stability before completing. The
          backend uses a minimal <code className="bg-gray-100 px-1 rounded">scratch</code> base
          image for the smallest possible attack surface; the frontend is served by{' '}
          <strong>Nginx 1.29</strong> with long-lived cache headers for static assets and SPA
          fallback routing.
        </p>
      </section>

      <section className="border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500 italic text-center">
          Built by{' '}
          <a
            href="https://github.com/niksis02"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-700 hover:underline"
          >
            niksis02
          </a>{' '}
          in a single 12-hour sprint. The algorithm is O(order × K). The infrastructure is
          O(overengineered). Three repos, two ECS services, one DNS record — all to tell you how
          many boxes to use. No regrets.
        </p>
      </section>
    </main>
  )
}
