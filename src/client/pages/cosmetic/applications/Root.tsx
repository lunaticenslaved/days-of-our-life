import { CosmeticApplicationsCalendar } from '#/client/entities/cosmetic/applications';
import { Page } from '#/client/widgets/Page';

export default function CosmeticApplicationsRootPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Применение косметики</Page.Title>
      </Page.Header>

      <Page.Content>
        <CosmeticApplicationsCalendar />
      </Page.Content>
    </Page>
  );
}
