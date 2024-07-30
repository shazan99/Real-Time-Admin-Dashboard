import { Col, Form, Input, InputNumber, Row, Select } from "antd"
import { Edit, useForm, useSelect } from "@refinedev/antd"
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import CustomAvatar from "@/components/custom-avatar";
import { getNameInitials } from "@/utilities/utilities";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { UsersSelectQuery } from "@/graphql/types";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import SelectOptionWithAvatar from "@/components/select-option-with-avatar";
import { businessTypeOptions, companySizeOptions, industryOptions } from "@/constants";

const EditPage = () => {

    const{ saveButtonProps, formProps, formLoading, queryResult } = useForm({
        redirect: false,
        meta: {
            gqlMutation: UPDATE_COMPANY_MUTATION
        }
    });

    const { avatarUrl, name } = queryResult?.data?.data || {}

    const { selectProps, queryResult: queryResultUsers } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
        resource: 'users',
        optionLabel: 'name',
        pagination: {
            mode: 'off'
        },
        meta: {
            gqlQuery: USERS_SELECT_QUERY
        }
    })

  return (
    <div>
        <Row gutter={[32, 32]}>
            <Col xs={24} xl={12}>
                <Edit
                    isLoading={formLoading}
                    saveButtonProps={saveButtonProps}
                    breadcrumb={false} 
                >
                    <Form {...formProps} layout="vertical">
                        <CustomAvatar 
                            shape="circle" 
                            src={avatarUrl} 
                            name={getNameInitials(name || '')}
                            style={{width: 96, height:96, marginBottom: '24px'}}/>
                        <Form.Item
                            label="Sales Owner"
                            name="salesOwnerId"
                            initialValue={formProps?.initialValues?.salesOwner?.id}
                        >
                            <Select 
                            placeholder="Please select a sales owner"
                            {...selectProps}
                            options={
                                queryResultUsers.data?.data.map((user) => ({
                                    value: user.id,
                                    label: (
                                        <SelectOptionWithAvatar
                                            name={user.name}
                                            avatarUrl={user.avatarUrl ?? undefined} 
                                        />
                                    )
                                })) ?? [] //if data is undefined return an empty array
                            }
                            />
                        </Form.Item>
                        <Form.Item label="Company Size">
                            <Select options={companySizeOptions} />
                        </Form.Item>
                        <Form.Item label="Total Revenue">
                            <InputNumber
                                autoFocus
                                addonBefore='$'
                                min={0}
                                placeholder="0,00"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value: string | undefined) => {
                                    if (!value) return '';
                                    const cleaned = value.replace(/\$\s?|(,*)/g, '');
                                    const num = parseFloat(cleaned);
                                    return isNaN(num) ? 0 : num;
                                }}
                                step={0.01}
                                precision={2} 
                            />
                        </Form.Item>
                        <Form.Item label="Industry">
                            <Select options={industryOptions}/>
                        </Form.Item>
                        <Form.Item label="Business Type">
                            <Select options={businessTypeOptions}/>
                        </Form.Item>
                        <Form.Item label="Country" name="country">
                            <Input placeholder="Country"/>
                        </Form.Item>
                        <Form.Item label="Website" name="website">
                            <Input placeholder="Website"/>
                        </Form.Item>
                    </Form>
                </Edit>
            </Col>
        </Row> 
    </div>
  )
}

export default EditPage