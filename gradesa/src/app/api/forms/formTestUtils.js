import { useTestRequest } from "@/backend/test/mock-request";
import { PUT } from "@/app/api/forms/[public_id]/[part_id]/[question_id]/route";
import { GET } from "@/app/api/forms/[public_id]/route";
import { GET as GET_AVERAGES } from "@/app/api/forms/[public_id]/answer/route";
import { TestFactory } from "@/backend/test/testfactory";

async function getUser() {
  return await TestFactory.user();
}

async function _submitAnswer(form, part, question, answer = 1, user) {
  const { mockPut, mockParams } = useTestRequest(user);

  const response = await PUT(
    mockPut(`/api/forms/${form.public_id}/${part.id}/${question.id}`, {
      answer,
    }),
    mockParams({
      public_id: form.public_id,
      part_id: part.id,
      question_id: question.id,
    })
  );
  return response;
}

async function _getForm(public_id, user) {
  const { mockGet, mockParams } = useTestRequest(user);
  const formResponse = await GET(
    mockGet(`/api/forms/${public_id}`),
    mockParams({
      public_id,
    })
  );
  return formResponse.json();
}

async function _getAverages(public_id, user) {
  const { mockGet, mockParams } = useTestRequest(user);
  const averagesResponse = await GET_AVERAGES(
    mockGet(`/api/forms/${public_id}/answer`),
    mockParams({ public_id })
  );
  return averagesResponse.json();
}

export async function getUtils() {
  const user = await getUser();
  return {
    submitAnswer: async (form, part, question, answer = 1) =>
      _submitAnswer(form, part, question, answer, user),
    getForm: async (public_id) => _getForm(public_id, user),
    getAverages: async (public_id) => _getAverages(public_id, user),
  };
}
