import {
  Cog,
  FileText,
  Home,
  ListFilter,
  MailQuestion,
  MessageSquareQuote,
  PawPrint,
  ShieldQuestion,
  UserRound
} from "lucide-react";
import type { StructureBuilder, StructureResolver } from "sanity/structure";

const singletonTypeNames = ["siteSettings", "homePage", "petIndexPage"];
const systemPageIds = [
  { title: "Not found", documentId: "systemPage-notFound" },
  { title: "Server error", documentId: "systemPage-serverError" },
  { title: "Generic error", documentId: "systemPage-genericError" }
];

function singletonItem(
  S: StructureBuilder,
  typeName: string,
  documentId: string,
  title: string,
  icon: React.ComponentType
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(documentId).title(title));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Pet Share Content")
    .items([
      S.listItem()
        .title("Settings")
        .icon(Cog)
        .child(
          S.list()
            .title("Settings")
            .items([
              singletonItem(S, "siteSettings", "siteSettings", "Site settings", Cog)
            ])
        ),
      S.listItem()
        .title("Pages")
        .icon(FileText)
        .child(
          S.list()
            .title("Pages")
            .items([
              singletonItem(S, "homePage", "homePage", "Home page", Home),
              singletonItem(S, "petIndexPage", "petIndexPage", "Pet index page", ListFilter),
              S.listItem()
                .title("System pages")
                .icon(ShieldQuestion)
                .child(
                  S.list()
                    .title("System pages")
                    .items([
                      ...systemPageIds.map((page) =>
                        singletonItem(S, "systemPage", page.documentId, page.title, ShieldQuestion)
                      ),
                      S.divider(),
                      S.documentTypeListItem("systemPage").title("All system pages")
                    ])
                ),
              S.documentTypeListItem("marketingPage").title("Standard Pages").icon(FileText)
            ])
        ),
      S.listItem()
        .title("Marketplace")
        .icon(PawPrint)
        .child(
          S.list()
            .title("Marketplace")
            .items([
              S.documentTypeListItem("pet").title("Pets").icon(PawPrint),
              S.documentTypeListItem("owner").title("Owners").icon(UserRound),
              S.documentTypeListItem("petType").title("Pet types").icon(PawPrint)
            ])
        ),
      S.listItem()
        .title("Reusable Content")
        .icon(MessageSquareQuote)
        .child(
          S.list()
            .title("Reusable Content")
            .items([
              S.documentTypeListItem("testimonial").title("Testimonials").icon(MessageSquareQuote)
            ])
        ),
      S.listItem()
        .title("Forms")
        .icon(MailQuestion)
        .child(
          S.list()
            .title("Forms")
            .items([
              S.documentTypeListItem("formDefinition").title("Form definitions").icon(MailQuestion)
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        return Boolean(id && !singletonTypeNames.includes(id));
      })
    ]);
