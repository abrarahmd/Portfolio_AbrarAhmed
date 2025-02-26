<script setup lang="ts">
import type { ISponsor } from "~/types/Response/Sponsors"

const { $config, $prepareMeta } = useNuxtApp()

const {
  status,
  error,
  data: sponsors,
} = await useLazyAsyncData<ISponsor[]>(
  "sponsors",
  () =>
    $fetch(
      "https://raw.githubusercontent.com/eggsy/.github/main/sponsors.json",
      {
        responseType: "json",
      },
    ),
  {
    server: false,
  },
)

useHead({
  title: "Resume & CV",
  meta: $prepareMeta({
    title: "Resume & CV",
    description:
      "I've included my resume and CV below for your consideration.",
    keywords: "Resume & CV",
    url: "https://abrarahmd.dev/donate",
  }),
  link: [
    {
      rel: "canonical",
      href: "hhttps://abrarahmd.dev/donate",
    },
  ],
})

const sortByPrice = (a: ISponsor, b: ISponsor) =>
  b.monthlyDollars - a.monthlyDollars

const getSortedSponsors = computed(() => {
  return {
    oneTime:
      sponsors.value
        ?.filter?.((sponsor) => sponsor.isOneTime)
        .sort(sortByPrice) || [],
    monthly:
      sponsors.value
        ?.filter?.((sponsor) => !sponsor.isOneTime)
        .sort(sortByPrice) || [],
  }
})
</script>

<template>
  <PageLayout
    title="Resume & CV"
    description="I've included my resume and CV below for your consideration."
    class="space-y-12"
  >
    <section class="space-y-4">
      <PageTitle>Resume</PageTitle>

      <div class="flex flex-wrap gap-x-4 gap-y-2">
        <Button :href="'https://drive.google.com/file/d/1i6HyFFM7oFP67qDobDYcC9Wto4W3JscJ/view'" blank>
          

          Link
        </Button>
      </div>
    </section>
    <section class="space-y-4">
      <PageTitle>Curriculum Vitae</PageTitle>

      <div class="flex flex-wrap gap-x-4 gap-y-2">
        <Button :href="'https://drive.google.com/file/d/12bMKllOUj3oH_8B-z_GEFyyXfMLdEg7K/view'" blank>
          

          Link
        </Button>
      </div>
    </section>

    
  </PageLayout>
</template>
