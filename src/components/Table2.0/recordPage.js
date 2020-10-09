import { ref, reactive } from "@vue/composition-api";
export function recordPage() {
  let a = ref(1);
  const fn = () => {

  }

  return {
    a,
    fn
  }
}