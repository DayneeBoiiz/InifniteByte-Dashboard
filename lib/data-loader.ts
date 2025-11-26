/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Papa from "papaparse";

export async function loadContactsCSVData(): Promise<Contact[]> {
  try {
    const response = await axios.get(`/contacts.csv`, {
      responseType: "text",
    });

    return new Promise((resolve, reject) => {
      Papa.parse(response.data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Transform the data to match our Contact interface
          const contacts: Contact[] = results.data.map((row: any) => ({
            id: row.id || "",
            first_name: row.first_name || "",
            last_name: row.last_name || "",
            email: row.email || "",
            phone: row.phone || "",
            title: row.title || "",
            email_type: row.email_type || "",
            contact_form_url: row.contact_form_url || "",
            created_at: row.created_at || "",
            updated_at: row.updated_at || "",
            agency_id: row.agency_id || "",
            firm_id: row.firm_id || "",
            department: row.department || "",
          }));
          resolve(contacts);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Error loading CSV data:", error);
    throw error;
  }
}

export async function loadAgenciesCSVData(): Promise<Agency[]> {
  try {
    const response = await axios.get(`/agencies.csv`, {
      responseType: "text",
    });

    return new Promise((resolve, reject) => {
      Papa.parse(response.data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Transform the data to match our Agency interface
          const agencies: Agency[] = results.data.map((row: any) => ({
            id: row.id || "",
            name: row.name || "",
            state: row.state || "",
            state_code: row.state_code || "",
            type: row.type || "",
            population: row.population || "",
            website: row.website || "",
            total_schools: row.total_schools || "",
            total_students: row.total_students || "",
            mailing_address: row.mailing_address || "",
            grade_span: row.grade_span || "",
            locale: row.locale || "",
            csa_cbsa: row.csa_cbsa || "",
            domain_name: row.domain_name || "",
            physical_address: row.physical_address || "",
            phone: row.phone || "",
            status: row.status || "",
            student_teacher_ratio: row.student_teacher_ratio || "",
            supervisory_union: row.supervisory_union || "",
            county: row.county || "",
            created_at: row.created_at || "",
            updated_at: row.updated_at || "",
          }));
          resolve(agencies);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Error loading agencies CSV data:", error);
    throw error;
  }
}
