import graphqlDataProvider, {
    GraphQLClient,
    liveProvider as graphqlLiveProvider
} from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { create } from "domain";
import { createClient } from "graphql-ws";
import type { BaseRecord, CreateParams, DeleteOneParams, UpdateParams } from "@refinedev/core";
import { clevertapEvent } from "@/utilities/clevertap";

export const API_BASE_URL = 'https://api.crm.refine.dev'
export const API_URL = `${API_BASE_URL}/graphql`
export const WS_URL = 'wss://api.crm.refine.dev/graphql'

export const client = new GraphQLClient(API_URL, {
    fetch: (url: string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options);
        } catch (error){
            return Promise.reject(error as Error);
        }
    }
})

//Web Socket GraphQL client to listen to changes
export const wsClient = typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
            const accessToken = localStorage.getItem("access_token");

            return {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            };
        }
    })
    : undefined;

const baseDataProvider = graphqlDataProvider(client);

// "companies" -> "Company", "tasks" -> "Task"
const toEntityName = (resource: string) => {
    const singular = resource.endsWith("ies")
        ? `${resource.slice(0, -3)}y`
        : resource.replace(/s$/, "");
    return singular.charAt(0).toUpperCase() + singular.slice(1);
};

// CleverTap event properties must be scalars, so drop nested objects/arrays
const scalarProps = (values: Record<string, unknown> = {}) =>
    Object.fromEntries(
        Object.entries(values).filter(
            ([, value]) => ["string", "number", "boolean"].includes(typeof value),
        ),
    ) as Record<string, string | number | boolean>;

// Every create/update/delete in the app is reported to CleverTap as
// "<Entity> Created" / "<Entity> Updated" / "<Entity> Deleted"
export const dataProvider: typeof baseDataProvider = {
    ...baseDataProvider,
    create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
        params: CreateParams<TVariables>,
    ) => {
        const result = await baseDataProvider.create<TData, TVariables>(params);
        clevertapEvent(`${toEntityName(params.resource)} Created`, {
            ...scalarProps(params.variables as Record<string, unknown>),
            Resource: params.resource,
            ID: String(result.data?.id ?? ""),
        });
        return result;
    },
    update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
        params: UpdateParams<TVariables>,
    ) => {
        const result = await baseDataProvider.update<TData, TVariables>(params);
        clevertapEvent(`${toEntityName(params.resource)} Updated`, {
            ...scalarProps(params.variables as Record<string, unknown>),
            Resource: params.resource,
            ID: String(params.id),
        });
        return result;
    },
    deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
        params: DeleteOneParams<TVariables>,
    ) => {
        const result = await baseDataProvider.deleteOne<TData, TVariables>(params);
        clevertapEvent(`${toEntityName(params.resource)} Deleted`, {
            Resource: params.resource,
            ID: String(params.id),
        });
        return result;
    },
};
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined;