// Local Mock for Supabase to allow the app to run without a backend
import type { Database } from './types';

// Mock types
type Session = any;
type User = any;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

class LocalSupabaseAuth {
  private listeners: Set<(event: string, session: Session | null) => void> = new Set();

  private getSessionFromStorage() {
    const data = localStorage.getItem('mock_supabase_session');
    return data ? JSON.parse(data) : null;
  }

  async signUp({ email, password, options }: any) {
    await delay(500);

    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      return { data: null, error: { message: "User already exists with this email" } };
    }

    const user = { id: generateId(), email, user_metadata: options?.data || {}, password };
    users.push(user);
    localStorage.setItem('mock_users', JSON.stringify(users));

    const session = { access_token: 'mock_token', user };
    localStorage.setItem('mock_supabase_session', JSON.stringify(session));

    // Auto-create profile
    const profiles = JSON.parse(localStorage.getItem('mock_db_profiles') || '[]');
    profiles.push({
      id: generateId(),
      user_id: user.id,
      display_name: options?.data?.display_name || email.split('@')[0],
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('mock_db_profiles', JSON.stringify(profiles));

    this.notifyListeners('SIGNED_IN', session);
    return { data: { user, session }, error: null };
  }

  async signInWithPassword({ email, password }: any) {
    await delay(500);

    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return { data: null, error: { message: "Invalid email or password. Please sign up first." } };
    }

    const session = { access_token: 'mock_token', user };
    localStorage.setItem('mock_supabase_session', JSON.stringify(session));
    this.notifyListeners('SIGNED_IN', session);
    return { data: { user, session }, error: null };
  }

  async signOut() {
    await delay(200);
    localStorage.removeItem('mock_supabase_session');
    this.notifyListeners('SIGNED_OUT', null);
    return { error: null };
  }

  async getSession() {
    return { data: { session: this.getSessionFromStorage() }, error: null };
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    this.listeners.add(callback);
    // Fire immediately with current session
    callback('INITIAL_SESSION', this.getSessionFromStorage());

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners.delete(callback);
          }
        }
      }
    };
  }

  private notifyListeners(event: string, session: Session | null) {
    this.listeners.forEach(listener => listener(event, session));
  }
}

class LocalSupabaseQueryBuilder {
  constructor(private table: string) { }

  private getTableData() {
    return JSON.parse(localStorage.getItem(`mock_db_${this.table}`) || '[]');
  }

  private saveTableData(data: any[]) {
    localStorage.setItem(`mock_db_${this.table}`, JSON.stringify(data));
  }

  select(columns?: string) {
    let data = this.getTableData();
    let queryChain: any = {
      eq: (col: string, val: any) => {
        data = data.filter((row: any) => row[col] === val);
        return queryChain;
      },
      order: (col: string, options?: { ascending: boolean }) => {
        data.sort((a: any, b: any) => {
          if (options?.ascending) return a[col] > b[col] ? 1 : -1;
          return a[col] < b[col] ? 1 : -1;
        });
        return queryChain;
      },
      limit: (num: number) => {
        data = data.slice(0, num);
        return queryChain;
      },
      single: async () => {
        await delay(100);
        return { data: data.length > 0 ? data[0] : null, error: null };
      },
      then: (resolve: any) => {
        return delay(100).then(() => resolve({ data, error: null }));
      }
    };
    return queryChain;
  }

  insert(payload: any) {
    const data = this.getTableData();
    const newEntry = {
      id: generateId(),
      created_at: new Date().toISOString(),
      ...payload,
    };
    data.push(newEntry);
    this.saveTableData(data);

    return {
      select: () => ({
        single: async () => {
          await delay(200);
          return { data: newEntry, error: null };
        }
      })
    };
  }
}

class LocalSupabaseStorage {
  from(bucket: string) {
    return {
      upload: async (path: string, file: File) => {
        await delay(500);
        // We'll just fake the upload and keep a local blob URL
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => {
        // Return a reliable dummy image or a blob if we wanted to be fancy
        return { data: { publicUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80' } };
      }
    };
  }
}

class LocalSupabaseFunctions {
  async invoke(functionName: string, options: any) {
    await delay(1500); // Simulate AI thinking

    const { imaging_type, body_region } = options?.body || {};

    const typeLabel = (imaging_type || 'scan').toUpperCase();
    const regionLabel = (body_region || 'targeted area').toLowerCase();

    const isDiseaseFound = Math.random() > 0.4;

    let analysisText = "";
    let findingsText = "";
    let diseaseName = "";
    let diseaseStage = "";
    let symptomsText = "";
    let recommendationsText = "";

    if (isDiseaseFound) {
      if (imaging_type === 'xray') {
        diseaseName = `Subtle Hairline Fracture`;
        diseaseStage = 'Acute (Undisplaced)';
        analysisText = `The radiological examination of the ${regionLabel} reveals a subtle undisplaced hairline fracture.`;
        findingsText = `Review of the radiograph reveals a faint, non-displaced radiolucent line, consistent with a subtle hairline fracture. The anatomical alignment is maintained with no significant displacement, step-off, or angulation. The adjacent bony structures appear intact, and no significant joint effusion or severe soft tissue swelling is definitively identified.`;
        symptomsText = "Patient may report localized pain, tenderness upon palpation, mild to moderate swelling, and pain exacerbated by weight-bearing or movement.";
        recommendationsText = `Conservative management with immobilization (such as a splint or cast) is typically recommended to promote healing and prevent displacement. Rest, elevation, and icing should be applied to reduce swelling. Orthopedic follow-up with repeat radiographs in 1-2 weeks is advised to monitor interval healing and alignment.`;
      } else if (imaging_type === 'ct') {
        diseaseName = `Mass Lesion / Nodularity in ${regionLabel}`;
        diseaseStage = 'Stage II';
        analysisText = `The structural ${typeLabel} analysis of the ${regionLabel} indicates a distinct anomalous formation.`;
        findingsText = `High-resolution slices show a hyperdense nodule measuring approximately 2.4cm in the ${regionLabel}. Surrounding tissue exhibits mild edema but no gross invasion into adjacent structures.`;
        symptomsText = "May present as chronic localized pressure, unexplained weight loss, or persistent localized discomfort.";
        recommendationsText = "Schedule a follow-up PET scan and consider an image-guided biopsy to determine malignancy.";
      } else if (imaging_type === 'mri') {
        diseaseName = `Tissue Inflammation / Tears in ${regionLabel}`;
        diseaseStage = 'Acute';
        analysisText = `Detailed soft-tissue ${typeLabel} of the ${regionLabel} shows signs of acute tissue distress.`;
        findingsText = `T2-weighted images demonstrate hyperintense signals throughout the ${regionLabel}, indicative of severe edema and possible micro-tearing of the connective fibers. No complete rupture is observed.`;
        symptomsText = "Significant swelling, reduced range of motion, and sharp pain during specific movements.";
        recommendationsText = "Strict rest, application of ice, and NSAIDs. Physical therapy consultation required in 2 weeks once acute inflammation subsides.";
      } else {
        diseaseName = `Dermatological Anomaly on ${regionLabel}`;
        diseaseStage = 'Stage I';
        analysisText = `Visual inspection of the ${regionLabel} indicates irregular pigmentation patterns.`;
        findingsText = `The lesion on the ${regionLabel} presents with asymmetric borders, varied coloration (including dark brown and erythematous areas), and a diameter exceeding 6mm.`;
        symptomsText = "Patient may report recent changes in size, shape, or color, accompanied by mild pruritus.";
        recommendationsText = "Urgent consultation with a dermatologist for an excisional biopsy to rule out malignant melanoma.";
      }
    } else {
      diseaseName = 'No Abnormalities Detected';
      diseaseStage = '';
      analysisText = `The ${typeLabel} of the ${regionLabel} appears entirely normal.`;
      findingsText = `Thorough examination of the ${regionLabel} shows intact anatomical structures. Tissue density, boundaries, and morphology are all within normal physiological limits. No signs of masses, lesions, or active inflammation.`;
      symptomsText = "N/A - Healthy profile.";
      recommendationsText = "No immediate medical intervention is required based on this scan. Continue with routine health maintenance.";
    }

    return {
      data: {
        disease_found: isDiseaseFound,
        disease_name: diseaseName,
        disease_stage: diseaseStage,
        analysis: {
          summary: analysisText,
          findings: findingsText,
          description: `Comprehensive AI-assisted radiological review of the ${typeLabel} imaging.`,
          symptoms: symptomsText,
          recommendations: recommendationsText
        }
      },
      error: null
    };
  }
}

// Main Client Export
export const supabase = {
  auth: new LocalSupabaseAuth(),
  from: (table: string) => new LocalSupabaseQueryBuilder(table),
  storage: new LocalSupabaseStorage(),
  functions: new LocalSupabaseFunctions(),
} as any; // Cast to any to bypass strict type bindings to the real @supabase/supabase-js definitions completely