import prismadb from "@/lib/prismadb"

export const getPatient = async (email: string) => {

  if (!email || email === "")
    return null


  const patient = await prismadb.patient.findUnique({
    where: {
      email: email
    }
  })


  if (!patient) return null

  if (patient) {
    return patient
  }

}