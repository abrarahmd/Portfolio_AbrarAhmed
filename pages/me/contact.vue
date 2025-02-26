<script setup lang="ts">
interface Link {
  url: string
  title: string
  description: string
  icon: string
}

const pageLoaded = ref(false)

const { $prepareMeta, $config } = useNuxtApp()

useHead({
  title: "Contact",
  meta: $prepareMeta({
    title: "Contact",
    description:
      "Need to get in touch with me? Have any questions? Click the links below!",
  }),
})

const titles = {
  twitter: "Follow me on Twitter!",
  github: "Follow me on GitHub!",
  linkedIn: "Connect with me on LinkedIn!",
}

const icons = {
  twitter: "line-md:twitter",
  github: "line-md:github",
  linkedIn: "line-md:linkedin",
}

const getLinks = computed(() => {
  const social = $config.public.social

  const array: Link[] = []

  for (const item in social) {
    if (item === "email") continue

    array.push({
      url: social[item as keyof typeof social],
      title: item?.[0]?.toUpperCase() + item.slice(1),
      description: titles[item as keyof typeof titles],
      icon: icons[item as keyof typeof icons],
    })
  }

  return array
})

onMounted(() => {
  pageLoaded.value = true
})
</script>

<template>
  <PageLayout
    title="Contact"
    description="If you have any queries, feel free to contact me."
  >
    <div class="grid gap-4 md:grid-cols-2">
      <Card
        v-for="(contact, index) in getLinks"
        :key="index"
        :title="contact.title"
        :href="contact.url"
        blank
      >
        <template #icon>
          <Icon :name="contact.icon" class="h-9 w-9" />
        </template>

        <span class="text-black/50 dark:text-white/30">
          {{ contact.description }}
        </span>
      </Card>

      <Card
        title="Email"
        :href="pageLoaded && $config.public.social.email ? `mailto:${$config.public.social.email}` : ''"
        :utm="false"
      >
        <template #icon>
          <Icon name="line-md:at" class="h-8 w-8" />
        </template>

        abrargroad2000@gmail.com
      </Card>

    </div>
  </PageLayout>
</template>
