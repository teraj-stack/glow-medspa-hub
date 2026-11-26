<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Vercel Git-triggered deployments disabled in `vercel.json` so repository sync does not deploy the app to Vercel.
- Consultation questions use a public same-origin streaming server route and server-only AI Gateway helpers; patient descriptions never enter persistent application storage or logs.
- Persist AI access/credit blocks in service-only operational state; never automatically replay a denied request across reloads or deployments.
