<script setup lang="ts">
import { Icon } from "@iconify/vue"

interface Education {
  institution: string
  degree: string
  field: string
  startYear: number
  endYear?: number
  location: string
  cgpa?: number // Add CGPA field
  gpa?: number
}

const educationHistory: Education[] = [
  {
    institution: "BRAC University",
    degree: "Computer Science & Engineering",
    field: "Engineering",
    startYear: 2021,
    location: "Dhaka, Bangladesh",
    cgpa: 3.62,
  },
  {
    institution: "Birshrestha Noor Mohammad Public College",
    degree: "Higher Secondary Certificate",
    field: "Science",
    startYear: 2018,
    endYear: 2020,
    location: "Dhaka, Bangladesh",
    gpa: 5,
  },
  {
    institution: "Birshrestha Noor Mohammad Public College",
    degree: "Secondary School Certificate",
    field: "Science",
    startYear: 2016,
    endYear: 2018,
    location: "Dhaka, Bangladesh",
    gpa: 5,
  },
  {
    institution: "Junior Laboratory High School",
    degree: "Junior School Certificate",
    field: "Science",
    startYear: 2015,
    endYear: 2016,
    location: "Dhaka, Bangladesh",
    gpa: 5,
  },
]

const { $prepareMeta } = useNuxtApp()

useHead({
  title: "Academic Journey",
  meta: $prepareMeta({
    title: "Academic Journey",
    description:
      "Here's a glimpse into my academic journey, showcasing my studies and achievements.",
  }),
})
</script>

<template>
  <PageLayout
    title="Academic Journey"
    description="Here's a glimpse into my academic journey, showcasing my studies and achievements."
    class="space-y-12"
  >
    <section>
      <PageTitle class="mb-6">My Academic Journey</PageTitle>

      <div class="relative border-l-4 border-gray-400 dark:border-gray-500 pl-6">
        <div
          v-for="(education, index) in educationHistory"
          :key="index"
          class="mb-8 relative"
        >
          <!-- Silver Icon -->
          <div
            class="absolute -left-[30px] top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-gray-400 dark:bg-gray-500 text-white w-10 h-10 rounded-full shadow-md"
          >
            <Icon icon="mdi:school" class="text-2xl" />
          </div>

          <div
            class="bg-gray-100 dark:bg-gray-800 shadow-md p-5 rounded-lg border border-gray-300 dark:border-gray-600 transition hover:scale-[1.02]"
          >
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {{ education.degree }} in {{ education.field }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ education.institution }} - {{ education.location }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ education.startYear }} - {{ education.endYear || "Present" }}
            </p>

            <p v-if="education.cgpa" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              CGPA: {{ education.cgpa }}
            </p>
            <p v-if="education.gpa" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              GPA: {{ education.gpa }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
</template>
